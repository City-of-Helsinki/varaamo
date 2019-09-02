import Moment from 'moment';
import { extendMoment } from 'moment-range';

import constants from '../constants/AppConstants';

const moment = extendMoment(Moment);

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(constants.DATE_FORMAT);
}

function getDateStartAndEndTimes(date, useTimeRange, startTime, endTime, duration) {
  if (!date) {
    return {};
  }
  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;
  if (useTimeRange && endTime && startTime) {
    const timeZone = moment().format('Z');
    const availableStart = `${date}T${startTime}:00${timeZone}`;
    const availableEnd = `${date}T${endTime}:00${timeZone}`;
    const availableBetween = `${availableStart},${availableEnd},${duration}`;
    return { availableBetween, end, start };
  }
  return { end, start };
}

function getDateString(date) {
  if (!date) {
    return moment().format(constants.DATE_FORMAT);
  }

  return date;
}

function getDuration(duration) {
  if (!duration) {
    return moment(constants.FILTER.timePeriod, constants.FILTER.timePeriodType).minutes();
  }
  return duration;
}

function getDurationHours(duration) {
  const value = duration || constants.FILTER.timePeriod;
  return value / 60;
}

function calculateDuration(duration, start, end) {
  const { timeFormat, timePeriodType } = constants.FILTER;
  const startTime = moment(start, timeFormat);
  const endTime = moment(end, timeFormat);
  const diffMinutes = endTime.diff(startTime, timePeriodType);
  return Math.min(duration, diffMinutes);
}

function getEndTimeString(endTime) {
  if (!endTime) {
    return '23:30';
  }
  return endTime;
}

function calculateEndTime(end, start) {
  const { timeFormat, timePeriod, timePeriodType } = constants.FILTER;
  const startTime = moment(start, timeFormat);
  const endTime = moment(end, timeFormat);
  if (startTime.isSameOrAfter(endTime)) {
    return startTime.add(timePeriod, timePeriodType).format(timeFormat);
  }
  return end;
}

function getStartTimeString(startTime) {
  if (!startTime) {
    const now = moment();
    const nextPeriod = moment()
      .startOf('hour')
      .add(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    while (nextPeriod.isBefore(now)) {
      nextPeriod.add(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    }
    return nextPeriod.format(constants.FILTER.timeFormat);
  }
  return startTime;
}

function isPastDate(date) {
  const now = moment();
  return moment(date).isBefore(now, 'day');
}

function prettifyHours(hours, showMinutes = false) {
  if (showMinutes && hours < 0.5) {
    const minutes = moment.duration(hours, 'hours').minutes();
    return `${minutes} min`;
  }

  const rounded = Math.ceil(hours * 2) / 2;
  return `${rounded} h`;
}

function padLeft(number) {
  return number < 10 ? `0${number}` : String(number);
}
/**
 * Convert time period to minutes;
 *
 * @param {string} period Time string, usually HH:MM:SS
 * @returns {Int} Period in minutes
 */
function periodToMinute(period) {
  return moment.duration(period).asMinutes();
}

/**
 * Get time different
 * This function can be use to compare time
 * @param {string} startTime ISO Time String
 * @param {string} endTime ISO Time String
 * @param {string} unit Define time unit
 * @param {boolean} isFloat Should result in float, default integer
 * @returns {int | float} timediff
 */
function getTimeDiff(startTime, endTime, unit, isFloat = false) {
  return moment(endTime).diff(moment(startTime), unit, isFloat);
}

export {
  addToDate,
  calculateDuration,
  calculateEndTime,
  getDateStartAndEndTimes,
  getDateString,
  getDuration,
  getDurationHours,
  getEndTimeString,
  getStartTimeString,
  isPastDate,
  prettifyHours,
  padLeft,
  periodToMinute,
  getTimeDiff
};
