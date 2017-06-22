import trim from 'lodash/trim';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { currentUserSelector } from 'state/selectors/authSelectors';
import SideNavbar from './SideNavbar';

const userNameInitialsSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (user.firstName || user.lastName) {
      return trim(user.firstName[0] + user.lastName[0]);
    } else if (user.email) {
      return user.email[0];
    }
    return user.emails && user.emails.length ? user.emails[0].value[0] : null;
  }
);

export const selector = createStructuredSelector({
  initials: userNameInitialsSelector,
});

export default connect(selector)(SideNavbar);
