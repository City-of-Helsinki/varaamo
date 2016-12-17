import trim from 'lodash/trim';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from 'actions/searchActions';
import currentUserSelector from 'state/selectors/currentUserSelector';
import isAdminSelector from 'state/selectors/isAdminSelector';
import isLoggedInSelector from 'state/selectors/isLoggedInSelector';
import Navbar from './Navbar';

const userNameSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (user.firstName || user.lastName) {
      return trim([user.firstName, user.lastName].join(' '));
    }
    return user.emails && user.emails.length ? user.emails[0].value : '';
  }
);

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
  userName: userNameSelector,
});

const actions = {
  clearSearchResults,
};

export default connect(selector, actions)(Navbar);
