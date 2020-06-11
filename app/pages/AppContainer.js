import MobileDetect from 'mobile-detect';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import firebase from 'firebase/app';

import { isAdminSelector } from '../state/selectors/authSelectors';
import { fetchUser } from '../actions/userActions';
import { enableGeoposition } from '../actions/uiActions';
import Favicon from '../shared/favicon/Favicon';
import Footer from '../../src/domain/footer/Footer';
import Header from '../../src/domain/header/Header';
import TestSiteMessage from '../shared/test-site-message/TestSiteMessage';
import { getCustomizationClassName } from '../utils/customizationUtils';
import Notifications from '../shared/notifications/NotificationsContainer';
import UserNotificator from '../../src/common/notificator/user/UserNotificator';
import AccessibilityShortcuts from '../shared/accessibility-shortcuts/AccessibilityShortcuts';
import FontSizes from '../constants/FontSizes';

const userIdSelector = (state) => state.auth.userId;
const languageSelector = (state) => state.intl && state.intl.locale;
const fontSizeSelector = (state) => state.ui.accessibility.fontSize;

export const selector = createStructuredSelector({
  isStaff: isAdminSelector,
  language: languageSelector,
  userId: userIdSelector,
  fontSize: fontSizeSelector,
});

export class UnconnectedAppContainer extends Component {
  constructor(props) {
    super(props);
    const mobileDetect = new MobileDetect(window.navigator.userAgent);
    if (mobileDetect.mobile()) {
      props.enableGeoposition();
    }
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.fetchUser(this.props.userId);
    }
    this.removeFacebookAppendedHash();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      this.props.fetchUser(nextProps.userId);
    }
  }

  removeFacebookAppendedHash() {
    if (window.location.hash && window.location.hash.indexOf('_=_') !== -1) {
      window.location.hash = ''; // for older browsers, leaves a # behind
      window.history.pushState('', document.title, window.location.pathname);
    }
  }

  render() {
    const { isStaff, language, fontSize } = this.props;
    const mainContentId = 'main-content';

    return (
      <>
        <AccessibilityShortcuts mainContentId={mainContentId} />
        <div className={classNames('app', getCustomizationClassName())}>
          <Helmet
            htmlAttributes={{ lang: this.props.language, class: fontSize }}
          >
            <title>Varaamo</title>
          </Helmet>

          <Header location={this.props.location}>
            <Favicon />
            <TestSiteMessage />
            {firebase.apps.length > 0 && (
              <UserNotificator isStaff={isStaff} language={language} />
            )}
          </Header>
          <div className="app-content" id={mainContentId}>
            <Grid>
              <Notifications />
              <NotificationContainer />
            </Grid>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  enableGeoposition: PropTypes.func.isRequired,
  isStaff: PropTypes.bool,
  language: PropTypes.string,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.string,
  fontSize: PropTypes.oneOf(Object.values(FontSizes)),
};

const actions = { enableGeoposition, fetchUser };

export default withRouter(connect(selector, actions)(UnconnectedAppContainer));
