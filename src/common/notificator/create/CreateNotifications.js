import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap/lib';
import { auth, firestore } from 'firebase';

class CreateNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      superuser: false,
      loading: true,
      notifications: [],
      email: '',
      password: '',
      newMessage: {}
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

  addNewMessage = () => {
    const { newMessage } = this.state;
    firestore().collection('notifications').add(newMessage)
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
    const { newMessage } = this.state;
    newMessage[field] = event.target.value;
    this.setState({ newMessage });
  };

  render() {
    const {
      email, password, superuser, loading, notifications, newMessage
    } = this.state;
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
                <span onClick={() => auth().signOut()}>Log out</span>
                <h4>Existing notifications</h4>
                {notifications.map(notification => (
                  <span>{notification.name}</span>
                ))}
                <br />
                <input
                  onChange={event => this.onFieldChange(event, 'name')}
                  type="text"
                  value={newMessage.name || ''}
                />
                <br />
                <textarea onChange={event => this.onFieldChange(event, 'message')} value={newMessage.message || ''} />
                <br />
                <button onClick={this.addNewMessage} type="submit">Add new</button>
              </div>
            )
          }
        </Grid>
      </div>
    );
  }
}

export default CreateNotifications;
