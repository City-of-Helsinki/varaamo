import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { firestore } from 'firebase';
import ReactHtmlWrapper from 'react-html-parser';
import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

class UserNotificator extends Component {
  static propTypes = {
    isStaff: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired
  };

  state = {
    notifications: []
  };

  componentDidMount() {
    this.unsubscribeNotificationListener = firestore()
      .collection('notifications')
      .where('active', '==', true)
      .onSnapshot(this.onNotificationSnapshot);
  }

  componentWillUnmount() {
    this.unsubscribeNotificationListener && this.unsubscribeNotificationListener();
  }

  onNotificationSnapshot = (querySnap) => {
    let cookies = document.cookie.replace('notifications=', '');
    cookies = cookies && cookies.split(',');

    const notifications = [];

    querySnap.forEach((doc) => {
      const notification = doc.data();
      notification.id = doc.id;
      if (!cookies.includes(notification.id) && moment(notification.until).isAfter()) {
        notifications.push(notification);
      }
    });
    this.setState({ notifications });
  };

  selectNotificationToShow = () => {
    const { isStaff } = this.props;
    const { notifications } = this.state;
    const sortedNotifications = orderBy(notifications, 'created');

    const notificationsForUser = sortedNotifications.filter(notification => notification.target === 'user');
    const notificationsForStaff = sortedNotifications.filter(notification => notification.target === 'staff');
    const notificationsForAll = sortedNotifications.filter(notification => notification.target === 'all');
    if (notificationsForAll.length > 0) {
      return notificationsForAll[0];
    }
    if (notificationsForStaff.length > 0 && isStaff) {
      return notificationsForStaff[0];
    }
    if (notificationsForUser.length > 0 && !isStaff) {
      return notificationsForUser[0];
    }
    return {};
  };


  closeNotificator = (notification) => {
    let cookies = document.cookie.replace('notifications=', '');
    cookies = (cookies && cookies.split(',')) || [];

    if (!cookies.includes(notification.id)) cookies.push(notification.id);
    document.cookie = `notifications=${cookies.join(',')}`;
    this.setState({ notifications: [] });
  };

  render() {
    const { language } = this.props;
    const notification = this.selectNotificationToShow();
    if (notification && !notification.message) return null;
    return (
      <div className={classNames('app-UserNotificator', {
        'app-UserNotificator__warning': notification.urgency === 'warning',
        'app-UserNotificator__danger': notification.urgency === 'danger'
      })}
      >
        <span className="close-notificator" onClick={() => this.closeNotificator(notification)}>X</span>
        <Grid className="container">
          <Row>
            <Col sm={12}>
              <span className="notification-message">
                { notification.message[language]
                  ? ReactHtmlWrapper(notification.message[language])
                  : ReactHtmlWrapper(notification.message.fi)
                }
              </span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserNotificator;
