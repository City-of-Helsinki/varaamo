import moment from 'moment';
import { createAction, handleActions } from 'redux-actions';

import actionTypes from 'constants/ActionTypes';
import modalTypes from 'constants/ModalTypes';

// actions
// -------

const actions = {
  changeBaseTime: createAction('app/recurringReservations/CHANGE_BASE_TIME'),
  changeFrequency: createAction('app/recurringReservations/CHANGE_FREQUENCY'),
  changeLastTime: createAction('app/recurringReservations/CHANGE_LAST_TIME'),
  changeNumberOfOccurrences: createAction('app/recurringReservations/CHANGE_NUMBER_OF_OCCURRENCES'),
};

// reducer
// -------

const initialState = {
  baseTime: null,
  frequency: '',
  lastTime: null,
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

function adjustState(state, changeLastTime = false) {
  if (!state.baseTime || !state.frequency || (!state.lastTime && !state.numberOfOccurrences)) {
    return { ...state, reservations: [] };
  }
  let newState;
  if (changeLastTime) {
    const start = moment(state.baseTime.begin).startOf('day');
    const end = moment(state.lastTime).startOf('day');
    const duration = moment.duration(end.diff(start));
    if (duration > 0) {
      newState = {
        ...state,
        numberOfOccurrences: parseInt(duration.as(state.frequency), 10),
      };
    } else {
      newState = {
        ...state,
        numberOfOccurrences: 1,
        lastTime: (
          moment(state.baseTime.begin)
          .add(1, 'days')
          .format('YYYY-MM-DD')
        ),
      };
    }
  } else {
    newState = {
      ...state,
      lastTime: (
          moment(state.baseTime.begin)
          .add(state.numberOfOccurrences, state.frequency)
          .format('YYYY-MM-DD')
      ),
    };
  }
  return { ...newState, reservations: populateReservations(newState) };
}

const recurringReservationsReducer = handleActions({
  [actions.changeBaseTime]: (state, action) => adjustState({
    ...state, baseTime: action.payload,
  }),
  [actions.changeFrequency]: (state, action) => adjustState({
    ...state, frequency: action.payload,
  }),
  [actions.changeLastTime]: (state, action) => adjustState({
    ...state, lastTime: action.payload,
  }, true),
  [actions.changeNumberOfOccurrences]: (state, action) => adjustState({
    ...state, numberOfOccurrences: parseInt(action.payload, 10),
  }),
  [actionTypes.UI.CLOSE_MODAL]: (state, action) => {
    const modalType = action.payload;
    if (
      modalType === modalTypes.RESERVATION_SUCCESS ||
      modalType === modalTypes.RESERVATION_CONFIRM
    ) {
      return initialState;
    }
    return state;
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
  selectLastTime(state) {
    return state.recurringReservations.lastTime;
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
