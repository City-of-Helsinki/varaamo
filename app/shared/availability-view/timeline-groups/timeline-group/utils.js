import some from 'lodash/some';
import moment from 'moment';

import {
  slotSize,
  slotWidth,
  slotMargin,
  slotFullDayWidth, slotMinuteWidth,
} from '../../../../constants/SlotConstants';
import { reservationLengthType } from '../../../../../src/domain/resource/constants';

function getMultidayPeriod(resource, date) {
  if (!resource.periods) {
    return undefined;
  }
  return resource.periods.find(
    period => moment(period.start).isSameOrBefore(moment(date))
      && moment(period.end).isSameOrAfter(moment(date))
      && (period.reservationLengthType === reservationLengthType.WHOLE_DAY
        || period.reservationLengthType === reservationLengthType.OVERNIGHT),
  );
}

function getWithinDayTimeSlotWidth(startTime, endTime) {
  const diff = endTime ? moment(endTime).diff(moment(startTime), 'minutes') : slotSize;
  const slots = Math.round(diff / slotSize);

  return slotWidth * slots - slotMargin;
}

function getMultidayTimeSlotWidth(startTime, endTime, date) {
  const isStartTimeBeforeDate = moment(startTime).isBefore(moment(date), 'day');
  const isEndTimeAfterDate = moment(endTime).isAfter(moment(date), 'day');
  const isWholeDay = isStartTimeBeforeDate && isEndTimeAfterDate;

  if (isWholeDay) {
    return slotFullDayWidth;
  }

  if (isStartTimeBeforeDate) {
    return moment(endTime).diff(moment(date).startOf('day'), 'minutes') * slotMinuteWidth;
  }

  if (isEndTimeAfterDate) {
    return moment(date).endOf('day').diff(moment(startTime), 'minutes') * slotMinuteWidth;
  }

  // Neither start nor end time is outside given date, get the within day slot width.
  return getWithinDayTimeSlotWidth(startTime, endTime);
}

function getTimeSlotWidth({ startTime, endTime, date } = {}) {
  if (!startTime || !endTime || !date) {
    return getWithinDayTimeSlotWidth(startTime, endTime);
  }

  const isWithinDay = moment(startTime).isSame(moment(date), 'day')
    && moment(endTime).isSame(moment(date), 'day');
  if (isWithinDay) {
    return getWithinDayTimeSlotWidth(startTime, endTime);
  }

  return getMultidayTimeSlotWidth(startTime, endTime, date);
}

function getMultidayTimelineItems(multidayPeriod, date, resource) {
  const resourceId = resource.id;
  const reservations = Array.isArray(resource.reservations)
    ? resource.reservations.filter(
      reservation => reservation.state !== 'cancelled' && reservation.state !== 'denied',
    )
    : [];
  const endingTime = {
    hours: moment
      .duration(multidayPeriod.multidaySettings.checkOutTime)
      .hours(),
    min: moment
      .duration(multidayPeriod.multidaySettings.checkOutTime)
      .minutes(),
  };
  const startingTime = {
    hours: moment.duration(multidayPeriod.multidaySettings.checkInTime).hours(),
    min: moment.duration(multidayPeriod.multidaySettings.checkInTime).minutes(),
  };

  const isWholeDayPeriod = multidayPeriod.reservationLengthType === reservationLengthType.WHOLE_DAY;
  const isOvernightPeriod = multidayPeriod.reservationLengthType === reservationLengthType.OVERNIGHT;

  const wholeDayReservation = reservations.find(
    reservation => moment(reservation.begin).isBefore(moment(date), 'day')
      && moment(reservation.end).isAfter(moment(date), 'day'),
  );
  const reservationEndingOnDate = reservations.find(
    reservation => moment(reservation.begin).isBefore(moment(date), 'day')
      && moment(reservation.end).isSame(moment(date), 'day'),
  );
  const reservationStartingOnDate = reservations.find(
    reservation => moment(reservation.end).isAfter(moment(date), 'day')
      && moment(reservation.begin).isSame(moment(date), 'day'),
  );

  const isWholeDayReserved = !!wholeDayReservation;
  const hasPartialDayReserved = reservationEndingOnDate || reservationStartingOnDate;

  // We want to populate the timeline as follows:

  // 1. For any day with no reservations, draw one single clickable block.
  if (!hasPartialDayReserved && !isWholeDayReserved) {
    return [
      {
        key: '1',
        type: 'multiday-reservation-slot',
        data: {
          begin: moment(date).startOf('day').format(),
          end: moment(date).endOf('day').format(),
          resourceId,
          isSelectable: true,
          reservationPeriod: multidayPeriod,
        },
      },
    ];
  }

  // 2. For days that are completely covered by a reservation, draw one single reservation block.
  if (isWholeDayReserved) {
    return [
      {
        key: '1',
        type: 'reservation',
        data: wholeDayReservation,
      },
    ];
  }
  // 3. If reservation only covers day partially, but period type is WHOLE_DAY
  if (isWholeDayPeriod && reservationEndingOnDate) {
    return [
      {
        key: '1',
        type: 'reservation',
        data: reservationEndingOnDate,
      },
      {
        key: '2',
        type: 'multiday-reservation-slot',
        data: {
          begin: moment(date)
            .startOf('day')
            .add(endingTime.hours, 'hours')
            .add(endingTime.min, 'minutes')
            .format(),
          end: moment(date).endOf('day').format(),
          resourceId,
          isSelectable: false,
          reservationPeriod: multidayPeriod,
        },
      },
    ];
  }
  if (isWholeDayPeriod && reservationStartingOnDate) {
    return [
      {
        key: '1',
        type: 'multiday-reservation-slot',
        data: {
          begin: moment(date).startOf('day').format(),
          end: moment(date)
            .startOf('day')
            .add(startingTime.hours, 'hours')
            .add(startingTime.min, 'minutes')
            .format(),
          resourceId,
          isSelectable: false,
          reservationPeriod: multidayPeriod,
        },
      },
      {
        key: '2',
        type: 'reservation',
        data: reservationStartingOnDate,
      },
    ];
  }

  // 3. If period type is OVERNIGHT and reservation doesn't cover the whole day:
  if (isOvernightPeriod && hasPartialDayReserved && !isWholeDayReserved) {
    // 3a. Has a single reservation from the beginning of the day to checkout time: reservation block,
    // followed by blank, clickable block from check-in to the end of the day.
    if (!reservationStartingOnDate && reservationEndingOnDate) {
      return [
        {
          key: '1',
          type: 'reservation',
          data: reservationEndingOnDate,
        },
        {
          key: '2',
          type: 'multiday-reservation-slot',
          data: {
            begin: moment(date)
              .startOf('day')
              .add(endingTime.hours, 'hours')
              .add(endingTime.min, 'minutes')
              .format(),
            end: moment(date)
              .startOf('day')
              .add(startingTime.hours, 'hours')
              .add(startingTime.min, 'minutes')
              .format(),
            resourceId,
            isSelectable: false,
            reservationPeriod: multidayPeriod,
          },
        },
        {
          key: '3',
          type: 'multiday-reservation-slot',
          data: {
            begin: moment(date)
              .startOf('day')
              .add(startingTime.hours, 'hours')
              .add(startingTime.min, 'minutes')
              .format(),
            end: moment(date).endOf('day').format(),
            resourceId,
            isSelectable: true,
            reservationPeriod: multidayPeriod,
          },
        },
      ];
    }

    // 3b. Has two reservations, one until checkout and one from check-in until the end of the day:
    // two reservation blocks with blank in between.
    if (reservationStartingOnDate && reservationEndingOnDate) {
      return [
        {
          key: '1',
          type: 'reservation',
          data: reservationEndingOnDate,
        },
        {
          key: '2',
          type: 'multiday-reservation-slot',
          data: {
            begin: moment(date)
              .startOf('day')
              .add(endingTime.hours, 'hours')
              .add(endingTime.min, 'minutes')
              .format(),
            end: moment(date)
              .startOf('day')
              .add(startingTime.hours, 'hours')
              .add(startingTime.min, 'minutes')
              .format(),
            resourceId,
            isSelectable: false,
            reservationPeriod: multidayPeriod,
          },
        },
        {
          key: '3',
          type: 'reservation',
          data: reservationStartingOnDate,
        },
      ];
    }

    // 3c. Has a single reservation from check-in until end of the day: fill with blank until check-in,
    // reservation block for the rest.
    if (reservationStartingOnDate) {
      return [
        {
          key: '1',
          type: 'multiday-reservation-slot',
          data: {
            begin: moment(date).startOf('day').format(),
            end: moment(date)
              .startOf('day')
              .add(startingTime.hours, 'hours')
              .add(startingTime.min, 'minutes')
              .format(),
            resourceId,
            isSelectable: false,
            reservationPeriod: multidayPeriod,
          },
        },
        {
          key: '2',
          type: 'reservation',
          data: reservationStartingOnDate,
        },
      ];
    }
  }

  // All cases covered, this return is here to keep the linter happy.
  return [];
}

function isInsideOpeningHours(item, openingHours) {
  return some(
    openingHours,
    opening => opening.opens <= item.data.begin && item.data.end <= opening.closes,
  );
}

function markItemSelectable(item, isSelectable, openingHours) {
  const selectable = isSelectable
    && moment().isSameOrBefore(item.data.end)
    && (!openingHours || isInsideOpeningHours(item, openingHours));
  return { ...item, data: { ...item.data, isSelectable: selectable } };
}

function markItemsSelectable(items, isSelectable, openingHours) {
  return items.map((item) => {
    if (item.type === 'reservation') return item;
    return markItemSelectable(item, isSelectable, openingHours);
  });
}

function addSelectionData(selection, resource, items) {
  if (!selection) {
    return markItemsSelectable(items, true, resource.openingHours);
  }
  if (selection.resourceId !== resource.id) {
    // isSelectable is false by default, so nothing needs to be done.
    // This is a pretty important performance optimization when there are tons of
    // resources in the AvailabilityView and the selection is in a state where the
    // first click has been done but the second (end time) hasn't. Without this
    // optimization we'd be calling markItemSelectable for every slot in every
    // resource when the user hovers to another slot.
    return items;
  }
  let lastSelectableFound = false;
  return items.map((item) => {
    if (lastSelectableFound || item.data.begin < selection.begin) {
      if (item.type === 'reservation') return item;
      // isSelectable is false by default.
      return item;
    }
    if (item.type === 'reservation') {
      lastSelectableFound = true;
      return item;
    }
    return markItemSelectable(item, true, resource.openingHours);
  });
}

function getTimelineItems(resource, date, reservations, resourceId, selection) {
  const multidayPeriod = getMultidayPeriod(resource, date);
  if (multidayPeriod) {
    return getMultidayTimelineItems(multidayPeriod, date, resource);
  }

  const items = [];
  let reservationPointer = 0;
  let timePointer = date.clone().startOf('day');
  const end = date.clone().endOf('day');
  while (timePointer.isBefore(end)) {
    const reservation = reservations && reservations[reservationPointer];
    const isSlotReservation = reservation && timePointer.isSame(reservation.begin);
    if (isSlotReservation) {
      items.push({
        key: String(items.length),
        type: 'reservation',
        data: reservation,
      });
      timePointer = moment(reservation.end);
      reservationPointer += 1;
    } else {
      items.push({
        key: String(items.length),
        type: 'reservation-slot',
        data: {
          begin: timePointer.format(),
          end: timePointer.clone().add(slotSize, 'minutes').format(),
          resourceId,
          // isSelectable: false by default to improve selector performance by allowing
          // addSelectionData to make some assumptions.
          isSelectable: false,
        },
      });
      timePointer.add(slotSize, 'minutes');
    }
  }
  return addSelectionData(selection, resource, items);
}

export default {
  getTimelineItems,
  getTimeSlotWidth,
};
