import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { purposesSelector } from 'state/selectors/dataSelectors';

const purposeArraySelector = createSelector(
  purposesSelector,
  purposes => values(purposes)
    .filter(purpose => purpose.parent === null)
);

const purposeListSelector = createStructuredSelector({
  isFetchingPurposes: requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  purposes: purposeArraySelector,
});

export default purposeListSelector;
