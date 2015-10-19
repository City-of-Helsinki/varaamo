import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import { logout } from 'actions/authActions';
import Navbar from 'components/layout/Navbar';
import { appSelectors } from 'selectors/appSelectors';

export class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { actions } = this.props;

    actions.logout();
    actions.pushState(null, '/login');
  }

  render() {
    const { children, user } = this.props;

    return (
      <DocumentTitle title="Respa">
        <div>
          <Navbar
            logout={this.handleLogout}
            user={user}
          />
          <Grid>
            {children}
          </Grid>
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
    logout,
    pushState,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(appSelectors, mapDispatchToProps)(UnconnectedApp);
