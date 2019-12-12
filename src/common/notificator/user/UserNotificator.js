import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { firestore } from 'firebase';
import ReactHtmlWrapper from 'react-html-parser';
import classNames from 'classnames';

class UserNotificator extends Component {
  state = {
    notifications: [],
    showNotificator: false,
  };

  componentDidMount() {
    this.unsubscribeNotificationListener = firestore().collection('notifications').onSnapshot((querySnap) => {
      const notifications = [];

      querySnap.forEach((doc) => {
        const notification = doc.data();
        notification.id = doc.id;
        notifications.push(notification);
      });
      const showNotificator = notifications && notifications.length > 0;
      this.setState({ notifications, showNotificator });
    });
  }

  componentWillUnmount() {
    this.unsubscribeNotificationListener && this.unsubscribeNotificationListener();
  }

  closeNotificator = () => {
    this.setState(prevState => ({
      showNotificator: !prevState.showNotificator
    }));
  };

  render() {
    const { notifications, showNotificator } = this.state;
    const notification = notifications[0] || {};

    if (showNotificator) {
      return (
        <div className={classNames('app-UserNotificator', {
          'app-UserNotificator__danger': notification.urgency === 'danger'
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
    return null;
  }
}

export default UserNotificator;
