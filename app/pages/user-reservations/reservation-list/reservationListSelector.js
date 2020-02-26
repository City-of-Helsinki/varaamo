import { createStructuredSelector } from 'reselect';

import { isAdminSelector } from '../../../state/selectors/authSelectors';

const reservationListSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
});

export default reservationListSelector;
