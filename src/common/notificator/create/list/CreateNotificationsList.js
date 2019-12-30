import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import moment from 'moment';

const CreateNotificationsList = (props) => {
  const { notifications, onClick } = props;
  return (
    <div className="notification-list">
      <h4>Notifications list</h4>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Until</th>
            <th>Target</th>
            <th>Urgency</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {notifications && notifications.map((notification, index) => (
            <tr key={index} onClick={() => onClick(notification)}>
              <th>{notification.name}</th>
              <th>{moment(notification.created).format('DD.MM.YYYY')}</th>
              <th>{moment(notification.until).format('DD.MM.YYYY')}</th>
              <th>{notification.target.label}</th>
              <th>{notification.urgency.label}</th>
              <th>{notification.active.label}</th>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

CreateNotificationsList.propTypes = {
  notifications: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};

export default CreateNotificationsList;
