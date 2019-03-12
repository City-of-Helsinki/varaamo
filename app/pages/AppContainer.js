import MobileDetect from 'mobile-detect';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BodyClassName from 'react-body-classname';
import Grid from 'react-bootstrap/lib/Grid';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { fetchUser } from 'actions/userActions';
import { enableGeoposition } from 'actions/uiActions';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Header from 'shared/header';
import TestSiteMessage from 'shared/test-site-message';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';

const userIdSelector = state => state.auth.userId;

export const selector = createStructuredSelector({
  userId: userIdSelector,
});

export class UnconnectedAppContainer extends Component {
  constructor(props) {
    super(props);
    const mobileDetect = new MobileDetect(window.navigator.userAgent);
    if (mobileDetect.mobile()) {
      props.enableGeoposition();
    }
  }

  getChildContext() {
    return {
      location: this.props.location,
    };
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
    return (
      <BodyClassName className={getCustomizationClassName()}>
        <Helmet>
          <title>Varaamo</title>
        </Helmet>

        <div className="app">
          <Header location={this.props.location}>
            <Favicon />
            <TestSiteMessage />
          </Header>
          <div className="app-content">
            <Grid>
              <Notifications />
            </Grid>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </BodyClassName>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  enableGeoposition: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

UnconnectedAppContainer.childContextTypes = {
  location: PropTypes.object,
};

const actions = { enableGeoposition, fetchUser };

export default withRouter(
  connect(
    selector,
    actions
  )(UnconnectedAppContainer)
);
