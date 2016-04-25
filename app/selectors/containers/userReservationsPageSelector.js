import isEmpty from 'lodash/lang/isEmpty';
import { createSelector } from 'reselect';

import isAdminSelector from 'selectors/isAdminSelector';

const resourcesSelector = (state) => state.data.resources;

const userReservationsPageSelector = createSelector(
  isAdminSelector,
  resourcesSelector,
  (
    isAdmin,
    resources
  ) => {
    return {
      isAdmin,
      resourcesLoaded: !isEmpty(resources),
    };
  }
);

export default userReservationsPageSelector;
