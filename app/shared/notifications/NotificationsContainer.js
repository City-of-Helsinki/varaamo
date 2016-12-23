import React, { Component, PropTypes } from 'react';
import ReactNotifications from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideNotification } from 'actions/notificationsActions';
import { injectT } from 'i18n';
import notificationsSelector from './notificationsSelector';

class UnconnectedNotificationsContainer extends Component {
  render() {
    const { actions, notifications, t } = this.props;
    const translatedNotifications = notifications.map(notification => ({
      ...notification,
      message: notification.message || t(notification.messageId),
    }));
    return (
      <ReactNotifications
        notifications={translatedNotifications}
        onRequestHide={actions.hideNotification}
      />
    );
  }
}

UnconnectedNotificationsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedNotificationsContainer = injectT(UnconnectedNotificationsContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    hideNotification,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedNotificationsContainer };
export default connect(notificationsSelector, mapDispatchToProps)(
  UnconnectedNotificationsContainer
);
