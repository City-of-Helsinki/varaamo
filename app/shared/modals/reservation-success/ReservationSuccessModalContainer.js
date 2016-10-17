import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationSuccessModal } from 'actions/uiActions';
import CompactReservationList from 'shared/compact-reservation-list';
import { getName } from 'utils/translationUtils';
import reservationSuccessModalSelector from './reservationSuccessModalSelector';
import ModalWrapper from '../ModalWrapper';

export class UnconnectedReservationSuccessModalContainer extends Component {
  renderEmail(email) {
    if (!email) {
      return '';
    }
    return <strong> {email}</strong>;
  }

  render() {
    const {
      actions,
      reservationsToShow,
      resources,
      show,
    } = this.props;

    const reservation = reservationsToShow.length ? reservationsToShow[0] : {};
    const resource = reservation.resource ? resources[reservation.resource] : {};

    return (
      <ModalWrapper
        className="reservation-success-modal"
        onClose={actions.closeReservationSuccessModal}
        show={show}
        title="Varauspyyntösi on lähetetty"
      >
        <p>
          Olet tehnyt alustavan varauksen tilaan {getName(resource)}
          {reservationsToShow.length === 1 ? ' ajalle:' : ' ajoille:'}
        </p>
        <CompactReservationList reservations={reservationsToShow} />
        <p>
          Varaus käsitellään kahden arkipäivän kuluessa. Tarkemmat tiedot alustavasta varauksesta
          lähetetään varauksen yhteydessä annettuun sähköpostiosoitteeseen
          {this.renderEmail(reservation.reserverEmailAddress)}.
        </p>
        <div className="modal-controls">
          <Button
            bsStyle="default"
            onClick={actions.closeReservationSuccessModal}
          >
            Takaisin
          </Button>
        </div>
      </ModalWrapper>
    );
  }
}

UnconnectedReservationSuccessModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationSuccessModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationSuccessModalSelector, mapDispatchToProps)(
  UnconnectedReservationSuccessModalContainer
);
