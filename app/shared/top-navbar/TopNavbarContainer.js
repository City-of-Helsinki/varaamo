import trim from 'lodash/trim';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from 'actions/searchActions';
import { currentUserSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { changeLocale } from 'i18n';
import TopNavbar from './TopNavbar';

const userNameSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (user.firstName || user.lastName) {
      return trim([user.firstName, user.lastName].join(' '));
    } else if (user.email) {
      return user.email;
    }
    return user.emails && user.emails.length ? user.emails[0].value : '';
  }
);

export const selector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  currentLanguage: currentLanguageSelector,
  userName: userNameSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(TopNavbar);
