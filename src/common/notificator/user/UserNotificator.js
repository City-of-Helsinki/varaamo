import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { firestore } from 'firebase';
import ReactHtmlWrapper from 'react-html-parser';
import classNames from 'classnames';

class UserNotificator extends Component {
  static propTypes = {
    isStaff: PropTypes.bool
  };

  state = {
    staffNotifications: [],
    userNotifications: [],
  };

  componentDidMount() {
    this.unsubscribeNotificationListener = firestore()
      .collection('notifications')
      .onSnapshot(this.onNotificationSnapshot);
  }

  componentWillUnmount() {
    this.unsubscribeNotificationListener && this.unsubscribeNotificationListener();
  }

  onNotificationSnapshot = (querySnap) => {
    const userNotifications = [];
    const staffNotifications = [];

    querySnap.forEach(doc => {
      const notification = doc.data();
      userNotifications.push(notification);
    });
    this.setState({ userNotifications });
  };

  closeNotificator = () => {
    this.setState(prevState => ({
      showNotificator: !prevState.showNotificator
    }));
  };

  render() {
    const { isStaff } = this.props;
    const { userNotifications } = this.state;
    const notification = userNotifications[0] || {};

    return (
      <div className={classNames('app-UserNotificator', {
        // 'app-UserNotificator__warning': notification.urgency.value === 'warning',
        // 'app-UserNotificator__danger': notification.urgency.value === 'danger'
      })}
      >
        <span className="close-notificator" onClick={this.closeNotificator}>X</span>
        <Grid className="container">
          <Row>
            <Col sm={12}>
              <span>{ ReactHtmlWrapper(notification.message) }</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserNotificator;
