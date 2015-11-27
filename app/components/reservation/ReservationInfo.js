import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Well } from 'react-bootstrap';

class ReservationInfo extends Component {
  getMaxPeriodText(maxPeriod) {
    if (!maxPeriod) {
      return null;
    }
    const asHours = moment.duration(maxPeriod).asHours();
    return (
      <p>
        {`Varauksen maksimipituus: ${asHours} tuntia`}
      </p>
    );
  }

  getMaxReservationsPerUserText(maxReservationsPerUser) {
    if (!maxReservationsPerUser) {
      return null;
    }
    return (
      <p>
        {`Maksimimäärä varauksia per käyttäjä: ${maxReservationsPerUser}`}
      </p>
    );
  }

  render() {
    const { resource } = this.props;

    return (
      <Well>
        {this.getMaxPeriodText(resource.maxPeriod)}
        {this.getMaxReservationsPerUserText(resource.maxReservationsPerUser)}
      </Well>
    );
  }
}

ReservationInfo.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default ReservationInfo;
