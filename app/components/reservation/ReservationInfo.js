import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Well } from 'react-bootstrap';

class ReservationInfo extends Component {
  renderLoginText(isLoggedIn, resource) {
    if (isLoggedIn || !resource.reservable) {
      return null;
    }
    return (
      <p>
        Sinun täytyy <a href="/login">kirjautua sisään</a>, jotta voit tehdä varauksen tähän tilaan.
      </p>
    );
  }

  renderMaxPeriodText(maxPeriod) {
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

  renderMaxReservationsPerUserText(maxReservationsPerUser) {
    if (!maxReservationsPerUser) {
      return null;
    }
    return (
      <p>
        {`Maksimimäärä varauksia per käyttäjä: ${maxReservationsPerUser}`}
      </p>
    );
  }

  renderReservationInfoText(reservationInfo) {
    return (
      <p>{reservationInfo}</p>
    );
  }

  render() {
    const { isLoggedIn, resource } = this.props;

    return (
      <Well>
        <h4>Ohjeet varaamiseen</h4>
        {this.renderReservationInfoText(resource.reservationInfo)}
        {this.renderMaxPeriodText(resource.maxPeriod)}
        {this.renderMaxReservationsPerUserText(resource.maxReservationsPerUser)}
        {this.renderLoginText(isLoggedIn, resource)}
      </Well>
    );
  }
}

ReservationInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
};

export default ReservationInfo;
