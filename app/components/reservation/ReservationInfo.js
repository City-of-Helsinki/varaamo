import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Well } from 'react-bootstrap';

class ReservationInfo extends Component {
  renderLoginText(isLoggedIn) {
    if (isLoggedIn) {
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

  renderReservationInfoText() {
    const mockReservationInfo = `
      Lorem ipsum dolor sit amet, id odio ludus torquatos per, eripuit apeirian deseruisse eos no.
      Mel ex aeque oporteat, sit nobis homero sensibus ea. Te eam porro atomorum philosophia.
      Invenire referrentur ei vim. Sed mollis ponderum ullamcorper ea, sit aliquid deseruisse
      incorrupte id, et qui probo consequat constituto.
    `;
    return (
      <p>{mockReservationInfo}</p>
    );
  }

  render() {
    const { isLoggedIn, resource } = this.props;

    return (
      <Well>
        <h4>Ohjeet varaamiseen</h4>
        {this.renderReservationInfoText()}
        {this.renderMaxPeriodText(resource.maxPeriod)}
        {this.renderMaxReservationsPerUserText(resource.maxReservationsPerUser)}
        {this.renderLoginText(isLoggedIn)}
      </Well>
    );
  }
}

ReservationInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
};

export default ReservationInfo;
