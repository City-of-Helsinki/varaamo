import _ from 'lodash';
import moment from 'moment';
import 'moment-range';

import { DATE_FORMAT, TIME_FORMAT } from 'constants/AppConstants';

export default {
  addToDate,
  getDateString,
  getTimeSlots,
};

function addToDate(date, daysToIncrement) {
  const newDate = moment(date).add(daysToIncrement, 'days');

  return newDate.format(DATE_FORMAT);
}

function getDateString(date) {
  if (!date) {
    return moment().format(DATE_FORMAT);
  }

  return date;
}

function getTimeSlots(start, end, period = '00:30:00', reservations = []) {
  if (!start || !end) {
    return [];
  }

  const range = moment.range(moment.utc(start), moment.utc(end));
  const duration = moment.duration(period);
  const reservationRanges = _.map(reservations, reservation => {
    return moment.range(moment(reservation.begin), moment(reservation.end));
  });
  const slots = [];

  range.by(duration, (startMoment) => {
    const startUTC = moment.utc(startMoment);
    const endUTC = moment.utc(startMoment).add(duration);
    const startLocal = startUTC.local();
    const endLocal = endUTC.local();
    const asString = `${startLocal.format(TIME_FORMAT)}\u2013${endLocal.format(TIME_FORMAT)}`;
    const slotRange = moment.range(startLocal, endLocal);
    const reserved = reservationRanges.some(
      reservationRange => reservationRange.overlaps(slotRange)
    );

    slots.push({
      asString,
      reserved,
      start: startUTC.toISOString(),
      end: endUTC.toISOString(),
    });
  }, true);

  return slots;
}
