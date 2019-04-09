import { slotSize, slotWidth, slotMargin } from 'constants/SlotConstants';

import some from 'lodash/some';
import moment from 'moment';

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
          // isSelectable: false by default to improve selector performance by allowing
          // addSelectionData to make some assumptions.
          isSelectable: false,
        },
      });
      timePointer.add(slotSize, 'minutes');
    }
  }
  return items;
}

function isInsideOpeningHours(item, openingHours) {
  return some(openingHours, opening => (
    opening.opens <= item.data.begin && item.data.end <= opening.closes
  ));
}

function markItemSelectable(item, isSelectable, openingHours) {
  const selectable = (
    isSelectable
    && moment().isSameOrBefore(item.data.end)
    && (!openingHours || isInsideOpeningHours(item, openingHours))
  );
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
  } if (selection.resourceId !== resource.id) {
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

export default {
  addSelectionData,
  getTimelineItems,
  getTimeSlotWidth,
};
