import values from 'lodash/values';
import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const purposesSelector = state => state.data.purposes;

const purposeArraySelector = createSelector(
  purposesSelector,
  purposes => values(purposes)
    .filter(purpose => purpose.parent === null)
);

const purposeListSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  purposeArraySelector,
  (
    isFetchingPurposes,
    purposes
  ) => ({
    isFetchingPurposes,
    purposes,
  })
);

export default purposeListSelector;
