import React, { Component, PropTypes } from 'react';
import ReactNotifications from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideNotification } from 'actions/notificationsActions';
import notificationsSelector from './notificationsSelector';

export class UnconnectedNotificationsContainer extends Component {
  render() {
    const { actions, notifications } = this.props;

    return (
      <ReactNotifications
        notifications={notifications}
        onRequestHide={actions.hideNotification}
      />
    );
  }
}

UnconnectedNotificationsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    hideNotification,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(notificationsSelector, mapDispatchToProps)(
  UnconnectedNotificationsContainer
);
