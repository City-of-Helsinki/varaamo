import constants from 'constants/AppConstants';

import filter from 'lodash/filter';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import some from 'lodash/some';
import moment from 'moment';


function getBeginOfSelection(selected) {
  return minBy(selected, 'begin');
}

function getEndOfSelection(selected) {
  return maxBy(selected, 'begin');
}

function getNextDayFromDate(date) {
  return date
    ? moment(date)
      .add(1, 'days')
      .format(constants.DATE_FORMAT)
    : null;
}

function getNextWeeksDays(date) {
  const selectedWeekDay = moment(date).day();
  if (selectedWeekDay === 0) {
    return 2;
  } if (selectedWeekDay === 6) {
    return 1;
  }
  return 0;
}

function getSecondDayFromDate(date) {
  return date
    ? moment(date)
      .add(2, 'days')
      .format(constants.DATE_FORMAT)
    : null;
}

function isInsideOpeningHours(slot, openingHours) {
  const date = moment(slot.start).format(constants.DATE_FORMAT);
  const slotOpeningHours = filter(openingHours, { date });
  return some(
    slotOpeningHours,
    opening => moment(opening.opens).isSameOrBefore(slot.start)
      && moment(slot.end).isSameOrBefore(opening.closes)
  );
}

function isSlotAfterSelected(slot, selected) {
  if (slot.editing) {
    return false;
  }
  const firstSelected = getBeginOfSelection(selected);
  return firstSelected.begin <= slot.start;
}

function isSlotSelectable(slot, selected, resource, lastSelectableFound, isAdmin) {
  if (!slot || !selected || !selected.length || !resource) {
    return true;
  }
  if ((!slot.editing && slot.reserved) || lastSelectableFound) {
    return false;
  }
  const firstSelected = getBeginOfSelection(selected);
  if (!isAdmin && resource.maxPeriod) {
    const durationParts = resource.maxPeriod.split(':');
    // eslint-disable-next-line no-mixed-operators
    const maxPeriodMinutes = 60 * durationParts[0] + durationParts[1];
    const maxEndDate = new Date(firstSelected.begin);
    maxEndDate.setMinutes(maxEndDate.getMinutes() + maxPeriodMinutes);
    if (new Date(slot.start) >= maxEndDate) {
      return false;
    }
  }
  const firstSelectedDate = new Date(firstSelected.begin);
  const slotStartDate = new Date(slot.start);
  return (
    firstSelectedDate <= slotStartDate && firstSelectedDate.getDate() === slotStartDate.getDate()
  );
}

function isSlotSelected(slot, selected) {
  if (!slot || !selected || !selected.length) {
    return false;
  }
  const firstSelected = getBeginOfSelection(selected);
  const lastSelected = getEndOfSelection(selected);
  return firstSelected.begin <= slot.start && lastSelected.end >= slot.end;
}

function isFirstSelected(slot, selected) {
  if (!slot || !selected || !selected.length) {
    return false;
  }
  const firstSelected = getBeginOfSelection(selected);
  return firstSelected.begin === slot.start;
}

function isHighlighted(slot, selected, hovered) {
  if (!slot || !selected || !hovered || !selected.length) {
    return false;
  }
  const firstSelected = getBeginOfSelection(selected);
  const firstSelectedDate = new Date(firstSelected.begin);
  const slotStartDate = new Date(slot.start);
  const hoveredDate = new Date(hovered.start);
  return (
    slotStartDate > firstSelectedDate
    && slotStartDate < hoveredDate
    && firstSelectedDate.getDate() === slotStartDate.getDate()
  );
}
/**
 * Check if current slot will over minPeriod
 * by adding minPeriod to slot start time
 * and compare with last slot end time
 *
 * @param {Object} selected
 * @param {Object} slot
 * @param {Object} lastSlot
 * @param {String | undefined} minPeriod: minPeriod limit, usuall HH:MM:SS
 * @returns
 */
function isUnderMinPeriod(selected, slot, lastSlot, minPeriod) {
  let isUnder = false;
  if (!slot.end || !lastSlot.end) {
    return isUnder;
  }

  if (!selected.length && minPeriod) {
    const minPeriodInMinutes = moment.duration(minPeriod).asMinutes();
    isUnder = moment(slot.start).add(minPeriodInMinutes, 'minutes') > (moment(lastSlot.end));
  }

  return isUnder;
}

export default {
  getNextDayFromDate,
  getNextWeeksDays,
  getSecondDayFromDate,
  isHighlighted,
  isInsideOpeningHours,
  isSlotAfterSelected,
  isSlotSelectable,
  isSlotSelected,
  isFirstSelected,
  isUnderMinPeriod,
};
