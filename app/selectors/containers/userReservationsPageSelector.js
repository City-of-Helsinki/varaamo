import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import isAdminSelector from 'selectors/isAdminSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const userReservationsPageSelector = createSelector(
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  (
    isAdmin,
    isFetchingResources
  ) => {
    return {
      isAdmin,
      isFetchingResources,
    };
  }
);

export default userReservationsPageSelector;
