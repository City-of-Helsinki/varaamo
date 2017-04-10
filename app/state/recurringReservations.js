import { createAction, handleActions } from 'redux-actions';

const actions = {
  changeFrequency: createAction('app/recurringReservations/CHANGE_FREQUENCY'),
  changeNumberOfOccurrences: createAction('app/recurringReservations/CHANGE_NUMBER_OF_OCCURRENCES'),
};

const initialState = {
  frequency: '',
  numberOfOccurrences: 1,
};
const recurringReservationsReducer = handleActions({
  [actions.changeFrequency]: (state, action) => ({
    ...state, frequency: action.payload,
  }),
  [actions.changeNumberOfOccurrences]: (state, action) => ({
    ...state, numberOfOccurrences: parseInt(action.payload, 10),
  }),
}, initialState);

const selectors = {
  select(state) {
    return state.recurringReservations;
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
