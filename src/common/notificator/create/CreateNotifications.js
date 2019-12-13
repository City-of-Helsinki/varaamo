import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { auth, firestore } from 'firebase';
import Loader from 'react-loader';
import moment from 'moment';

import CreateNotificationsForm from './form/CreateNotificationsForm';
import CreateNotificationsList from './list/CreateNotificationsList';
import CreateNotificationModal from './modal/CreateNotificationModal';

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
        active: {
          value: true,
          label: 'True'
        },
        created: moment().startOf('day').format('YYYYMMDDTHHmmss'),
        until: moment().toDate()
      },
      selectedNotification: {},
      isOpen: false,
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
        notification.until = moment(notification.until).toDate();
        notifications.push(notification);
      });
      this.setState({ notifications });
    });
  }

  componentWillUnmount() {
    this.unsubscribeAuthListener && this.unsubscribeAuthListener();
    this.unsubscribeNotificationsListener && this.unsubscribeNotificationsListener();
  }

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

  onSelectedFieldChange = (event, field) => {
    const { selectedNotification } = this.state;
    selectedNotification[field] = event.target.value;
    this.setState({ selectedNotification });
  };

  addElement = (element) => {
    const { newNotification } = this.state;
    newNotification.message += ` ${element}`;
    this.setState({ newNotification });
  };

  onNotificationSelect = (notification) => {
    const selectedNotification = JSON.parse(JSON.stringify(notification));
    // Turn selectedNotification.until back to date so DayPicker wont crash
    selectedNotification.until = moment(selectedNotification.until).toDate();
    this.setState({ selectedNotification, isOpen: true });
  };

  onHide = () => {
    this.setState({
      isOpen: false,
      selectedNotification: {}
    });
  };

  addNotification = () => {
    const newNotification = JSON.parse(JSON.stringify(this.state.newNotification));
    // Modify data so it will be saved correctly
    newNotification.until = moment(newNotification.until).format('YYYYMMDDTHHmmss');

    firestore().collection('notifications').add(newNotification)
      .then(() => {
        // Reset values
        this.setState({
          newNotification: {
            active: {
              value: true,
              label: 'True'
            },
            created: moment().startOf('day').format('YYYYMMDDTHHmmss'),
            until: moment().toDate()
          }
        });
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log('ERROR', err));
  };

  saveNotification = () => {
    const selectedNotification = JSON.parse(JSON.stringify(this.state.selectedNotification));
    firestore().collection('notifications').doc(selectedNotification.id).set(selectedNotification)
      .then(() => {
        this.setState({
          isOpen: false,
          selectedNotification: {}
        });
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log('ERROR', err));
  };

  deleteNotification = () => {
    const { selectedNotification } = this.state;
    firestore().collection('notifications').doc(selectedNotification.id).delete()
      .then(() => {
        this.setState({
          selectedNotification: {}
        });
      })
    // eslint-disable-next-line no-console
      .catch(err => console.log('ERROR', err));
  };

  render() {
    const {
      email, isOpen, password, superuser, loading, notifications, newNotification, selectedNotification
    } = this.state;

    return (
      <div className="app-CreateNotifications">
        <Loader loaded={!loading}>
          <Grid>
            {!superuser && !loading
              && (
              <div className="login">
                <div className="center">
                  <span>Email</span>
                  <input onChange={e => this.setState({ email: e.target.value })} value={email} />
                  <span>Password</span>
                  <input onChange={e => this.setState({ password: e.target.value })} type="password" value={password} />
                  <button onClick={this.logIn} type="submit">Log in</button>
                </div>
              </div>
              )
            }

            {superuser && !loading
              && (
              <React.Fragment>
                <CreateNotificationsForm
                  addElement={this.addElement}
                  addNew={this.addNotification}
                  newNotification={newNotification}
                  onFieldChange={this.onFieldChange}
                />
                <CreateNotificationsList
                  notifications={notifications}
                  onClick={this.onNotificationSelect}
                />
              </React.Fragment>
              )
            }
          </Grid>
        </Loader>
        <CreateNotificationModal
          addElement={this.addElement}
          isOpen={isOpen}
          onDelete={() => this.setState({ isOpen: false }, () => this.deleteNotification())}
          onFieldChange={this.onSelectedFieldChange}
          onHide={this.onHide}
          save={this.saveNotification}
          selectedNotification={selectedNotification}
        />
      </div>
    );
  }
}

export default CreateNotifications;
