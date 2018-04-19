import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { purposesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = values(purposes)
      .filter(purpose => purpose.parent === null)
      .map(purpose => ({
        value: purpose.id,
        label: purpose.name,
      }));
    return sortBy(purposeOptions, 'label');
  }
);

const homePageSelector = createStructuredSelector({
  isFetchingPurposes: requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  purposes: purposeOptionsSelector,
});

export default homePageSelector;
