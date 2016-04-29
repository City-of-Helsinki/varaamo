import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { closeReservationInfoModal, selectReservationToEdit } from 'actions/uiActions';
import { putReservation } from 'actions/reservationActions';
import TimeRange from 'components/common/TimeRange';
import reservationInfoModalSelector from 'selectors/containers/reservationInfoModalSelector';
import { getName } from 'utils/DataUtils';
import { renderReservationStateLabel } from 'utils/renderUtils';

export class UnconnectedReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  handleEdit() {
    const { actions, reservationsToShow, resources } = this.props;
    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    if (!reservation) {
      return;
    }
    const resource = reservation ? resources[reservationsToShow[0].resource] : {};
    const query = queryString.stringify({
      date: reservation.begin.split('T')[0],
      time: reservation.begin,
    });

    actions.selectReservationToEdit({ reservation, minPeriod: resource.minPeriod });
    actions.closeReservationInfoModal();
    actions.updatePath(`/resources/${reservation.resource}/reservation?${query}`);
  }

  handleSave() {
    const { actions, reservationsToShow } = this.props;
    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    if (!reservation) {
      return;
    }
    const comments = this.refs.commentsInput.getValue();
    actions.putReservation(Object.assign({}, reservation, { comments }));
    actions.closeReservationInfoModal();
  }

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
          <dd>{this.getAddress(reservation.reserverAddressStreet, reservation.reserverAddressZip, reservation.reserverAddressCity)}</dd>
          <dt>Laskutusosoite:</dt>
          <dd>{this.getAddress(reservation.billingAddressStreet, reservation.billingAddressZip, reservation.billingAddressCity)}</dd>
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
      isEditingReservations,
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
          <Button
            bsStyle="primary"
            onClick={this.handleEdit}
          >
            Muokkaa
          </Button>
          <Button
            bsStyle="success"
            disabled={isEditingReservations}
            onClick={this.handleSave}
            type="submit"
          >
            {isEditingReservations ? 'Tallennetaan...' : 'Tallenna'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationInfoModal.propTypes = {
  actions: PropTypes.object.isRequired,
  isEditingReservations: PropTypes.bool.isRequired,
  reservationsToShow: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationInfoModal,
    putReservation,
    selectReservationToEdit,
    updatePath,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationInfoModalSelector, mapDispatchToProps)(
  UnconnectedReservationInfoModal
);
