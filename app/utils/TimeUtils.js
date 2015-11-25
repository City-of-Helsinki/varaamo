import _ from 'lodash';
import moment from 'moment';
import 'moment-range';

import { DATE_FORMAT, TIME_FORMAT } from 'constants/AppConstants';

export default {
  addToDate,
  getDateStartAndEndTimes,
  getDateString,
  getTimeSlots,
};

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(DATE_FORMAT);
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
    return moment().format(DATE_FORMAT);
  }

  return date;
}

function getTimeSlots(start, end, period = '00:30:00', reservations = [], reservationsToEdit = []) {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment.utc(start), moment.utc(end));
  const duration = moment.duration(period);
  const reservationRanges = _.map(reservations, reservation => {
    return moment.range(moment(reservation.begin), moment(reservation.end));
  });
  const editRanges = _.map(reservationsToEdit, reservation => {
    return moment.range(moment(reservation.begin), moment(reservation.end));
  });
  const slots = [];

  range.by(duration, (startMoment) => {
    const startUTC = moment.utc(startMoment);
    const endUTC = moment.utc(startMoment).add(duration);
    const startLocal = startUTC.local();
    const endLocal = endUTC.local();

    const asISOString = `${startUTC.toISOString()}/${endUTC.toISOString()}`;
    const asString = `${startLocal.format(TIME_FORMAT)}\u2013${endLocal.format(TIME_FORMAT)}`;

    const slotRange = moment.range(startLocal, endLocal);
    const editing = editRanges.some(
      editRange => editRange.overlaps(slotRange)
    );

    let reserved = false;
    let reservation = null;
    _.forEach(reservationRanges, (reservationRange, index) => {
      if (reservationRange.overlaps(slotRange)) {
        reserved = true;
        reservation = reservations[index];
      }
    });

    slots.push({
      asISOString,
      asString,
      editing,
      reservation,
      reserved,
      start: startUTC.toISOString(),
      end: endUTC.toISOString(),
    });
  }, true);

  return slots;
}
