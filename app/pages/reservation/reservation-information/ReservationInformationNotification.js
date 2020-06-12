import React from 'react';
import PropTypes from 'prop-types';

const ReservationInformationNotification = ({ children, labelText }) => {
  return (
    <div className="hds-notification hds-notification--warning">
      <div className="hds-notification__label">
        <span aria-hidden="true" className="hds-icon hds-icon--alert-circle" />
        <span className="text-md text-bold">{labelText}</span>
      </div>
      <div className="hds-notification__body text-body">{children}</div>
    </div>
  );
};

ReservationInformationNotification.propTypes = {
  labelText: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ReservationInformationNotification;
