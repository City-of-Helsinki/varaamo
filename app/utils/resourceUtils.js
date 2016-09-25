import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

function isOpenNow(resource) {
  const { closes, opens } = getOpeningHours(resource);
  const now = moment();
  if (now >= moment(opens) && now <= moment(closes)) {
    return true;
  }
  return false;
}

function getAvailabilityDataForWholeDay(resource = {}) {
  const { closes, opens } = getOpeningHours(resource);
  const reservations = resource.reservations || [];

  if (!closes || !opens) {
    return { text: 'Suljettu', bsStyle: 'danger' };
  }

  const opensMoment = moment(opens);
  const closesMoment = moment(closes);
  let total = closesMoment - opensMoment;

  forEach(
    filter(reservations, reservation => reservation.state !== 'cancelled'),
    (reservation) => {
      const resBeginMoment = moment(reservation.begin);
      const resEndMoment = moment(reservation.end);
      total = (total - resEndMoment) + resBeginMoment;
    }
  );

  const asHours = moment.duration(total).asHours();
  const rounded = Math.ceil(asHours * 2) / 2;

  if (rounded === 0) {
    return { text: 'Varattu koko päivän', bsStyle: 'danger' };
  }

  return {
    text: rounded === 1 ? `Vapaata ${rounded} tunti` : `Vapaata ${rounded} tuntia`,
    bsStyle: 'success',
  };
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

function getOpeningHours(resource) {
  if (resource && resource.openingHours && resource.openingHours.length) {
    return {
      closes: resource.openingHours[0].closes,
      opens: resource.openingHours[0].opens,
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
  isOpenNow,
  getAvailabilityDataForWholeDay,
  getCurrentReservation,
  getHumanizedPeriod,
  getNextReservation,
  getOpeningHours,
  getPeopleCapacityString,
};
