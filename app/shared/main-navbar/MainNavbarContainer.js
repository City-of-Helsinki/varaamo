import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from 'actions/searchActions';
import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { changeLocale } from 'i18n';
import MainNavbar from './MainNavbar';

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbar);
