import {Map} from 'immutable';

const initialState = Map({
  category: 'all',
});

export function search(state = initialState, action) {
  switch (action.type) {

  default:
    return state;
  }
}
