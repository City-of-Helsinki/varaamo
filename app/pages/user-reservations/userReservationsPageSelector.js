import { createStructuredSelector } from 'reselect';

import { isAdminSelector } from '../../state/selectors/authSelectors';
import { reservationsSelector } from '../../state/selectors/dataSelectors';

const userReservationsPageSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  reduxReservations: reservationsSelector,
});

export default userReservationsPageSelector;
