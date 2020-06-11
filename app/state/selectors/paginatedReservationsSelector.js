import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { createSelector } from 'reselect';
import moment from 'moment';

const paginatedSelector = (state) => {
  let paginatedData;

  if (
    state.data &&
    state.data.paginatedReservations &&
    state.data.paginatedReservations.undefined
  ) {
    paginatedData = { ...state.data.paginatedReservations.undefined };
  }

  if (isEmpty(paginatedData)) {
    return {
      count: 0,
      comingReservations: [],
      pastReservations: [],
    };
  }

  const reservations = paginatedData.results.map((res) => {
    return state.data.reservations[res];
  });

  paginatedData.pastReservations = reservations.filter((res) =>
    moment(res.end).isBefore()
  );

  paginatedData.comingReservations = reservations.filter((res) =>
    moment(res.end).isAfter()
  );
  paginatedData.comingReservations = orderBy(
    values(paginatedData.comingReservations),
    ['begin'],
    ['asc']
  );

  return paginatedData;
};

const paginatedReservationsSelector = createSelector(
  paginatedSelector,
  (reservations) => reservations
);

export default paginatedReservationsSelector;
