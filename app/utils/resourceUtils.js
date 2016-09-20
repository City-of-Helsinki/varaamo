import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

function getAvailableTime(openingHours = {}, reservations = []) {
  const { closes, opens } = openingHours;

  if (!closes || !opens) {
    return '0 tuntia vapaana';
  }

  const nowMoment = moment();
  const opensMoment = moment(opens);
  const closesMoment = moment(closes);

  if (nowMoment > closesMoment) {
    return '0 tuntia vapaana';
  }

  const beginMoment = nowMoment > opensMoment ? nowMoment : opensMoment;
  let total = closesMoment - beginMoment;

  forEach(
    filter(reservations, reservation => (
      reservation.state !== 'cancelled' && moment(reservation.end) > nowMoment
    )),
    (reservation) => {
      const resBeginMoment = moment(reservation.begin);
      const resEndMoment = moment(reservation.end);
      const maxBeginMoment = nowMoment > resBeginMoment ? nowMoment : resBeginMoment;
      total = (total - resEndMoment) + maxBeginMoment;
    }
  );

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  return rounded === 1 ? `${rounded} tunti vapaana` : `${rounded} tuntia vapaana`;
}


function getCurrentReservation(reservations) {
  const now = moment();
  return find(
    reservations, reservation => moment(reservation.begin) < now && now < moment(reservation.end)
  );
}

function getHumanizedPeriod(period) {
  if (!period) {
    return '';
  }
  return `${moment.duration(period).hours()}h`;
}

function getNextReservation(reservations) {
  const now = moment();
  const orderedReservations = sortBy(reservations, reservation => moment(reservation.begin));
  return find(orderedReservations, reservation => now < moment(reservation.begin));
}

function getOpeningHours(item) {
  if (item && item.openingHours && item.openingHours.length) {
    return {
      closes: item.openingHours[0].closes,
      opens: item.openingHours[0].opens,
    };
  }

  return {};
}

function getPeopleCapacityString(capacity) {
  if (!capacity) {
    return '';
  }
  return `max ${capacity} hengelle.`;
}

export {
  getAvailableTime,
  getCurrentReservation,
  getHumanizedPeriod,
  getNextReservation,
  getOpeningHours,
  getPeopleCapacityString,
};
