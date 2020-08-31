import React, { useState, useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { clearSearchResults } from '../../../app/actions/searchActions';
import { isAdminSelector, isLoggedInSelector } from '../../../app/state/selectors/authSelectors';
import changeLocale from '../../../app/i18n/changeLocale';
import MainNavbar from './MainNavbar';
import { ApiClient } from '../../common/api/client';
import settings from '../../../config/settings';

const apiClient = new ApiClient(settings.ACCESSIBILITY_API_URL, false);

const MainNavbarContainer = (props) => {
  const [viewpoints, setViewpoints] = useState([]);

  useEffect(() => {
    apiClient.get('viewpoints').then(
      ({ error, data }) => {
        if (error || viewpoints.length) return;
        if (Array.isArray(data)) setViewpoints(data);
      },
    );
  });

  return (
    <MainNavbar {...props} viewpoints={viewpoints} />
  );
};

export const selector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isLoggedIn: isLoggedInSelector,
});

const actions = {
  changeLocale,
  clearSearchResults,
};

export default connect(selector, actions)(MainNavbarContainer);
