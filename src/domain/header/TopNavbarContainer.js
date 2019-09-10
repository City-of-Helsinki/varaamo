import trim from 'lodash/trim';
import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from '../../../app/actions/searchActions';
import { currentUserSelector, isLoggedInSelector } from '../../../app/state/selectors/authSelectors';
import { currentLanguageSelector } from '../../../app/state/selectors/translationSelectors';
import changeLocale from '../../../app/i18n/changeLocale';
import TopNavbar from './TopNavbar';

const userNameSelector = createSelector(
  currentUserSelector,
  (user) => {
    if (user.firstName || user.lastName) {
      return trim([user.firstName, user.lastName].join(' '));
    } if (user.email) {
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
