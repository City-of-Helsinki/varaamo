import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationInfoModal } from 'actions/uiActions';
import TimeRange from 'components/common/TimeRange';
import reservationInfoModalSelector from 'selectors/containers/reservationInfoModalSelector';
import { getName } from 'utils/DataUtils';
import { renderReservationStateLabel } from 'utils/renderUtils';

export class UnconnectedReservationInfoModal extends Component {
  renderModalContent(reservation, resource) {
    if (!reservation) {
      return null;
    }

    return (
      <div>
        {renderReservationStateLabel(reservation)}
        <dl className="dl-horizontal">
          <dt>Nimi:</dt><dd>{reservation.reserverName}</dd>
          <dt>Puhelinnumero:</dt><dd>{reservation.reserverPhoneNumber}</dd>
          <dt>Sähköposti:</dt><dd>{reservation.reserverEmailAddress}</dd>
          <dt>Osoite:</dt>
          <dd>
            {reservation.reserverAddressStreet}, {reservation.reserverAddressZip} {reservation.reserverAddressCity}
          </dd>
          <dt>Laskutusosoite:</dt>
          <dd>
            {reservation.billingAddressStreet}, {reservation.billingAddressZip} {reservation.billingAddressCity}
          </dd>
          <dt>Yhdistys:</dt><dd>{reservation.company}</dd>
          <dt>Y-tunnus:</dt><dd>{reservation.businessId}</dd>
          <dt>Varauksen ajankohta:</dt>
          <dd><TimeRange begin={reservation.begin} end={reservation.end} /></dd>
          <dt>Tila:</dt><dd>{getName(resource)}</dd>
          <dt>Osallistujamäärä:</dt><dd>{reservation.numberOfParticipants}</dd>
          <dt>Tilaisuuden kuvaus:</dt><dd>{reservation.eventDescription}</dd>
        </dl>
        <form>
          <Input
            defaultValue={reservation.comments}
            label="Kommentit:"
            placeholder="Varauksen mahdolliset lisätiedot"
            ref="commentsInput"
            rows={5}
            type="textarea"
          />
        </form>
      </div>
    );
  }

  render() {
    const {
      actions,
      reservationsToShow,
      resources,
      show,
    } = this.props;

    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    const resource = reservation ? resources[reservationsToShow[0].resource] : {};

    return (
      <Modal
        className="reservation-info-modal"
        onHide={actions.closeReservationInfoModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Varauksen tiedot</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderModalContent(reservation, resource)}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationInfoModal}
          >
            Takaisin
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationInfoModal.propTypes = {
  actions: PropTypes.object.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationInfoModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationInfoModalSelector, mapDispatchToProps)(
  UnconnectedReservationInfoModal
);
