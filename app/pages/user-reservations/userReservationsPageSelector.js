import { createStructuredSelector } from 'reselect';

import { isAdminSelector } from '../../state/selectors/authSelectors';

const userReservationsPageSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
});

export default userReservationsPageSelector;
