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
};

const recurringReservationsReducer = handleActions({
  [actions.changeBaseTime]: (state, action) => ({
    ...state, baseTime: action.payload,
  }),
  [actions.changeFrequency]: (state, action) => ({
    ...state, frequency: action.payload,
  }),
  [actions.changeNumberOfOccurrences]: (state, action) => ({
    ...state, numberOfOccurrences: parseInt(action.payload, 10),
  }),
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
};

export default {
  ...actions,
  reducer: recurringReservationsReducer,
  ...selectors,
};
