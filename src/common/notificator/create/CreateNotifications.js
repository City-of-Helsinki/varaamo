import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap/lib';
import { auth, firestore } from 'firebase';
import Select from 'react-select';
import moment from 'moment';

import NotificationDatePicker from '../date/NotificatorDatePicker';

class CreateNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      superuser: false,
      loading: true,
      notifications: [],
      email: '',
      password: '',
      newNotification: {
        until: moment().toDate()
      }
    };
  }

  componentDidMount() {
    this.unsubscribeAuthListener = auth().onAuthStateChanged((user) => {
      this.setState({ superuser: !!user, loading: false });
    });

    this.unsubscribeNotificationsListener = firestore().collection('notifications').onSnapshot((querySnap) => {
      const notifications = [];
      querySnap.forEach((doc) => {
        const notification = doc.data();
        notification.id = doc.id;
        notifications.push(notification);
      });
      this.setState({ notifications });
    });
  }

  componentWillUnmount() {
    this.unsubscribeAuthListener && this.unsubscribeAuthListener();
    this.unsubscribeNotificationsListener && this.unsubscribeNotificationsListener();
  }

  addElement = (element) => {
    const { newNotification } = this.state;
    newNotification.message += ` ${element}`;
    this.setState({ newNotification });
  };

  addNewNotification = () => {
    const { newNotification } = this.state;
    firestore().collection('notifications').add(newNotification)
    // eslint-disable-next-line no-console
      .catch(err => console.log('ERROR', err));
  };

  logIn = () => {
    const { email, password } = this.state;
    auth().signInWithEmailAndPassword(email, password)
    // eslint-disable-next-line no-console
      .catch(err => console.log('ERROR', err));
  };

  onFieldChange = (event, field) => {
    const { newNotification } = this.state;
    newNotification[field] = event.target.value;
    this.setState({ newNotification });
  };

  render() {
    const {
      email, password, superuser, loading, notifications, newNotification
    } = this.state;
    const targetOptions = [
      { value: 'staff', label: 'Staff' },
      { value: 'user', label: 'User' },
      { value: 'all', label: 'All' }
    ];
    const urgencyOptions = [
      { value: 'warning', label: 'Warning' },
      { value: 'danger', label: 'Danger' }
    ];
    return (
      <div className="app-CreateNotifications">
        <Grid>
          {!superuser && !loading
            ? (
              <div className="login">
                <span>Email</span>
                <input onChange={e => this.setState({ email: e.target.value })} value={email} />
                <span>Password</span>
                <input onChange={e => this.setState({ password: e.target.value })} type="password" value={password} />
                <button onClick={this.logIn} type="submit">Log in</button>
              </div>
            )
            : (
              <div>
                <span onClick={() => auth().signOut()}>Sign out</span>
                <h4>Create new notification</h4>
                <Row>
                  <Col sm={3}>
                    <span>Name</span>
                    <input
                      onChange={event => this.onFieldChange(event, 'name')}
                      value={newNotification.name || ''}
                    />
                  </Col>
                  <Col sm={3}>
                    <span>Target</span>
                    <Select
                      className="app-Select"
                      classNamePrefix="app-Select"
                      options={targetOptions}
                      placeholder="Select"
                      value={newNotification.target}
                    />
                  </Col>
                  <Col sm={3}>
                    <span>Urgency</span>
                    <Select
                      className="app-Select"
                      classNamePrefix="app-Select"
                      options={urgencyOptions}
                      placeholder="Select"
                      value={newNotification.urgency}
                    />
                  </Col>
                  <Col sm={3}>
                    <span>Until</span>
                    <NotificationDatePicker
                      date={newNotification.until}
                      onChange={this.onFieldChange}
                    />
                  </Col>
                </Row>
                <Row className="action-row">
                  <Col sm={12}>
                    <button
                      onClick={() => this.addElement('<a href="http://" target="_blank">Text</a>')}
                      type="button"
                    >
                      {'</a>'}
                    </button>

                    <button
                      onClick={() => this.addElement('<b></b>')}
                      type="button"
                    >
                      {'<b>'}
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <textarea
                      onChange={event => this.onFieldChange(event, 'message')}
                      placeholder="Notification message"
                      rows={5}
                      value={newNotification.message || ''}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="button-row" sm={12}>
                    <button onClick={this.addNewNotification} type="submit">Add</button>
                  </Col>
                </Row>

                <div className="notification-list">
                  <h4>Notifications list</h4>
                  {notifications && notifications.map(notification => (
                    <span>{notification.name}</span>
                  ))}
                </div>
              </div>
            )
          }
        </Grid>
      </div>
    );
  }
}

export default CreateNotifications;
