import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import { logout } from 'actions/authActions';
import { clearSearchResults } from 'actions/searchActions';
import Footer from 'components/layout/Footer';
import Navbar from 'components/layout/Navbar';
import Notifications from 'containers/Notifications';
import appSelector from 'selectors/containers/appSelector';

export class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { actions } = this.props;

    actions.logout();
    actions.pushState(null, '/');
  }

  render() {
    const { actions, children, user } = this.props;

    return (
      <DocumentTitle title="Respa">
        <div className="app">
          <Navbar
            logout={this.handleLogout}
            clearSearchResults={actions.clearSearchResults}
            user={user}
          />
          <div className="app-content">
            <Grid>
              <Notifications />
              {children}
            </Grid>
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedApp.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  user: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearSearchResults,
    logout,
    pushState,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(appSelector, mapDispatchToProps)(UnconnectedApp);
