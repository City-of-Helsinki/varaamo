import moment from 'moment';
import { createAction, handleActions } from 'redux-actions';

// actions
// -------

const actions = {
  changeBaseTime: createAction('app/recurringReservations/CHANGE_BASE_TIME'),
  changeFrequency: createAction('app/recurringReservations/CHANGE_FREQUENCY'),
  changeNumberOfOccurrences: createAction('app/recurringReservations/CHANGE_NUMBER_OF_OCCURRENCES'),
};

// reducer
// -------

const initialState = {
  baseTime: null,
  frequency: '',
  numberOfOccurrences: 1,
  reservations: [],
};

export function populateReservations({ baseTime, frequency, numberOfOccurrences }) {
  const reservations = [];
  if (!baseTime || !frequency) {
    return reservations;
  }
  const begin = moment(baseTime.begin);
  const end = moment(baseTime.end);
  for (let i = 1; i <= numberOfOccurrences; i += 1) {
    reservations.push({
      begin: begin.clone().add(i, frequency).toISOString(),
      end: end.clone().add(i, frequency).toISOString(),
    });
  }
  return reservations;
}

const recurringReservationsReducer = handleActions({
  [actions.changeBaseTime]: (state, action) => ({
    ...state, baseTime: action.payload,
  }),
  [actions.changeFrequency]: (state, action) => {
    const frequency = action.payload;
    return {
      ...state,
      frequency,
      reservations: populateReservations({ ...state, frequency }),
    };
  },
  [actions.changeNumberOfOccurrences]: (state, action) => {
    const numberOfOccurrences = parseInt(action.payload, 10);
    return {
      ...state,
      numberOfOccurrences,
      reservations: populateReservations({ ...state, numberOfOccurrences }),
    };
  },
}, initialState);

// selectors
// ---------

const selectors = {
  select(state) {
    return state.recurringReservations;
  },
  selectBaseTime(state) {
    return state.recurringReservations.baseTime;
  },
  selectFrequency(state) {
    return state.recurringReservations.frequency;
  },
  selectNumberOfOccurrences(state) {
    return state.recurringReservations.numberOfOccurrences;
  },
  selectReservations(state) {
    return state.recurringReservations.reservations;
  },
};

export default {
  ...actions,
  reducer: recurringReservationsReducer,
  ...selectors,
};
