import forEach from 'lodash/forEach';
import map from 'lodash/map';
import moment from 'moment';
import 'moment-range';

import constants from 'constants/AppConstants';

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(constants.DATE_FORMAT);
}

function getDateStartAndEndTimes(date) {
  if (!date) {
    return {};
  }

  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;

  return { start, end };
}

function getDateString(date) {
  if (!date) {
    return moment().format(constants.DATE_FORMAT);
  }

  return date;
}

function getTimeSlots(start, end, period = '00:30:00', reservations = [], reservationsToEdit = []) {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment.utc(start), moment.utc(end));
  const duration = moment.duration(period);
  const reservationRanges = map(reservations, reservation => (
    moment.range(moment(reservation.begin), moment(reservation.end))
  ));
  const editRanges = map(reservationsToEdit, reservation => (
    moment.range(moment(reservation.begin), moment(reservation.end))
  ));
  const slots = [];

  range.by(duration, (startMoment) => {
    const startUTC = moment.utc(startMoment);
    const endUTC = moment.utc(startMoment).add(duration);
    const startLocal = startUTC.local();
    const endLocal = endUTC.local();

    const asISOString = `${startUTC.toISOString()}/${endUTC.toISOString()}`;
    const asString = (
      `${startLocal.format(constants.TIME_FORMAT)}\u2013${endLocal.format(constants.TIME_FORMAT)}`
    );

    const slotRange = moment.range(startLocal, endLocal);
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
      start: startUTC.toISOString(),
      end: endUTC.toISOString(),
    });
  }, true);

  return slots;
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
  getDateStartAndEndTimes,
  getDateString,
  getTimeSlots,
  prettifyHours,
};
