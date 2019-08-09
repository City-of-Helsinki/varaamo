import filter from 'lodash/filter';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import some from 'lodash/some';
import moment from 'moment';

import constants from '../../../constants/AppConstants';

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
    const maxEndDate = moment(firstSelected.begin);
    maxEndDate.minutes(maxEndDate.minutes() + maxPeriodMinutes);
    if (moment(slot.start).isSameOrAfter(maxEndDate)) {
      return false;
    }
  }
  const firstSelectedDate = moment(firstSelected.begin);
  const slotStartDate = moment(slot.start);
  return (
    moment(firstSelectedDate).isSameOrBefore(slotStartDate) && moment(firstSelectedDate).isSame(slotStartDate, 'date')
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
  const firstSelectedDate = moment(firstSelected.begin);
  const slotStartDate = moment(slot.start);
  const hoveredDate = moment(hovered.start);
  return (
    slotStartDate > firstSelectedDate
    && slotStartDate < hoveredDate
    && firstSelectedDate.isSame(slotStartDate, 'date')
  );
}
/**
 * Check if current slot will over minPeriod
 * by adding minPeriod to slot start time
 * and compare with last slot end time
 *
 * @param {Object} slot
 * @param {Object} lastSlot
 * @param {String | undefined} minPeriod: minPeriod limit, usuall HH:MM:SS
 * @returns
 */
function isUnderMinPeriod(slot, lastSlot, minPeriod) {
  if (!slot || !lastSlot) {
    return false;
  }

  if (!slot.end || !lastSlot.end) {
    return false;
  }
  if (minPeriod) {
    const minPeriodInMinutes = moment.duration(minPeriod).asMinutes();
    return moment(slot.start).add(minPeriodInMinutes, 'minutes') > (moment(lastSlot.end));
  }

  return false;
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
