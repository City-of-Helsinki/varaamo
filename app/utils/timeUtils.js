import forEach from 'lodash/forEach';
import map from 'lodash/map';
import moment from 'moment';
import 'moment-range';

import constants from 'constants/AppConstants';

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(constants.DATE_FORMAT);
}

function getDateStartAndEndTimes(date, startTime, endTime, duration) {
  if (!date) {
    return {};
  }
  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;
  if (endTime && startTime) {
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
    const nextPeriod = moment().startOf('hour').add(
      constants.FILTER.timePeriod,
      constants.FILTER.timePeriodType);
    while (nextPeriod.isBefore(now)) {
      nextPeriod.add(constants.FILTER.timePeriod, constants.FILTER.timePeriodType);
    }
    return nextPeriod.format(constants.FILTER.timeFormat);
  }
  return startTime;
}

function getTimeSlots(start, end, period = '00:30:00', reservations = [], reservationsToEdit = []) {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment(start), moment(end));
  const duration = moment.duration(period);
  const reservationRanges = map(reservations, reservation => (
    moment.range(moment(reservation.begin), moment(reservation.end))
  ));
  const editRanges = map(reservationsToEdit, reservation => (
    moment.range(moment(reservation.begin), moment(reservation.end))
  ));
  const slots = [];

  range.by(duration, (startMoment) => {
    const endMoment = moment(startMoment).add(duration);
    const asISOString = `${startMoment.toISOString()}/${endMoment.toISOString()}`;
    const asString = (
      `${startMoment.format(constants.TIME_FORMAT)}\u2013${endMoment.format(constants.TIME_FORMAT)}`
    );

    const slotRange = moment.range(startMoment, endMoment);
    const editing = editRanges.some(
      editRange => editRange.overlaps(slotRange)
    );

    let reserved = false;
    let reservation = null;
    let reservationStarting = false;
    let reservationEnding = false;
    forEach(reservationRanges, (reservationRange, index) => {
      if (reservationRange.overlaps(slotRange)) {
        reserved = true;
        reservation = reservations[index];
        const [reservationStart, reservationEnd] = reservationRange.toDate();
        const [slotStart, slotEnd] = slotRange.toDate();
        reservationStarting = reservationStart.getTime() === slotStart.getTime();
        reservationEnding = reservationEnd.getTime() === slotEnd.getTime();
      }
    });

    slots.push({
      asISOString,
      asString,
      editing,
      reservation,
      reservationStarting,
      reservationEnding,
      reserved,
      start: startMoment.toISOString(),
      end: endMoment.toISOString(),
    });
  }, true);

  return slots;
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
  getTimeSlots,
  isPastDate,
  prettifyHours,
};
