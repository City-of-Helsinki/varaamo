import some from 'lodash/some';
import moment from 'moment';

import { slotSize, slotWidth, slotMargin } from 'shared/availability-view';

function getTimeSlotWidth({ startTime, endTime } = {}) {
  const diff = endTime ? endTime.diff(startTime, 'minutes') : slotSize;
  const slots = Math.floor(diff / slotSize);

  return (slotWidth * slots) - slotMargin;
}

function getTimelineItems(date, reservations, resourceId) {
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
        },
      });
      timePointer.add(slotSize, 'minutes');
    }
  }
  return items;
}

function isInsideAvailableHours(item, availableHours) {
  return some(availableHours, availability => (
    availability.starts <= item.data.begin && item.data.end <= availability.ends
  ));
}

function markItemSelectable(item, isSelectable, availableHours) {
  const isInFuture = moment().isSameOrBefore(item.data.end);
  const selectable = isInFuture && (
    isSelectable && availableHours ?
    isInsideAvailableHours(item, availableHours) :
    isSelectable
  );
  return { ...item, data: { ...item.data, isSelectable: selectable } };
}

function markItemsSelectable(items, isSelectable, availableHours) {
  return items.map((item) => {
    if (item.type === 'reservation') return item;
    return markItemSelectable(item, isSelectable, availableHours);
  });
}

function addSelectionData(selection, resource, items) {
  if (!selection) {
    return markItemsSelectable(items, true, resource.availableHours);
  } else if (selection.resourceId !== resource.id) {
    return markItemsSelectable(items, false);
  }
  let lastSelectableFound = false;
  return items.map((item) => {
    if (lastSelectableFound || item.data.begin < selection.begin) {
      if (item.type === 'reservation') return item;
      return markItemSelectable(item, false);
    }
    if (item.type === 'reservation') {
      lastSelectableFound = true;
      return item;
    }
    return markItemSelectable(item, true, resource.availableHours);
  });
}

export default {
  addSelectionData,
  getTimelineItems,
  getTimeSlotWidth,
};
