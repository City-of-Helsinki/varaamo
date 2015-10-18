import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import { login } from 'actions/authActions';

export class UnconnectedLoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const { actions } = this.props;

    actions.login({ userId: 'u-1' });
    actions.pushState(null, '/');
  }

  render() {
    return (
      <DocumentTitle title="Kirjaudu sisään - Respa">
        <div>
          <h1>Kirjaudu sisään</h1>
          <Button
            bsStyle="primary"
            onClick={this.handleLogin}
          >
            Kirjaudu sisään
          </Button>
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedLoginPage.propTypes = {
  actions: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    login,
    pushState,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(null, mapDispatchToProps)(UnconnectedLoginPage);
