import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationInfoModal } from 'actions/uiActions';
import { putReservation } from 'actions/reservationActions';
import TimeRange from 'components/common/TimeRange';
import reservationInfoModalSelector from 'selectors/containers/reservationInfoModalSelector';
import {
  isStaffEvent,
  getMissingReservationValues,
  getName,
} from 'utils/DataUtils';
import { renderReservationStateLabel } from 'utils/renderUtils';

export class UnconnectedReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  handleSave() {
    const { actions, reservationsToShow, resources } = this.props;
    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    if (!reservation) {
      return;
    }
    const resource = reservation ? resources[reservationsToShow[0].resource] : {};
    const staffEvent = isStaffEvent(reservation, resource);
    const missingValues = getMissingReservationValues(reservation);
    const comments = this.refs.commentsInput.getValue();
    actions.putReservation(Object.assign(
      {},
      reservation,
      missingValues,
      { comments },
      { staffEvent }
    ));
    actions.closeReservationInfoModal();
  }

  renderModalContent(reservation, resource, isAdmin, isStaff) {
    if (!reservation) {
      return null;
    }

    return (
      <div>
        {renderReservationStateLabel(reservation)}
        <dl className="dl-horizontal">
          <dt>Varaaja / vuokraaja:</dt><dd>{reservation.reserverName}</dd>
          {isStaff && (
            <span><dt>Y-tunnus / henkilötunnus:</dt><dd>{reservation.reserverId}</dd></span>
          )}
          <dt>Puhelinnumero:</dt><dd>{reservation.reserverPhoneNumber}</dd>
          <dt>Sähköposti:</dt><dd>{reservation.reserverEmailAddress}</dd>
          <dt>Tilaisuuden kuvaus:</dt><dd>{reservation.eventDescription}</dd>
          <dt>Osallistujamäärä:</dt><dd>{reservation.numberOfParticipants}</dd>
          <dt>Osoite:</dt>
          <dd>
            {this.getAddress(
              reservation.reserverAddressStreet,
              reservation.reserverAddressZip,
              reservation.reserverAddressCity
            )}
          </dd>
          <dt>Laskutusosoite:</dt>
          <dd>
            {this.getAddress(
              reservation.billingAddressStreet,
              reservation.billingAddressZip,
              reservation.billingAddressCity
            )}
          </dd>
          <dt>Varauksen ajankohta:</dt>
          <dd><TimeRange begin={reservation.begin} end={reservation.end} /></dd>
          <dt>Tila:</dt><dd>{getName(resource)}</dd>
          {isAdmin && reservation.state === 'cancelled' && (
            <span>
              <dt>Kommentit:</dt>
              <dd>{reservation.comments}</dd>
            </span>
          )}
        </dl>
        {isAdmin && reservation.state !== 'cancelled' && (
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
        )}
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
      staffUnits,
    } = this.props;

    const reservation = reservationsToShow.length ? reservationsToShow[0] : undefined;
    const resource = reservation ? resources[reservationsToShow[0].resource] : {};
    const isAdmin = resource.userPermissions && resource.userPermissions.isAdmin;
    const isStaff = includes(staffUnits, resource.unit);
    const showSaveButton = isAdmin && reservation && reservation.state !== 'cancelled';

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
          {this.renderModalContent(reservation, resource, isAdmin, isStaff)}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationInfoModal}
          >
            Takaisin
          </Button>
          {showSaveButton && (
            <Button
              bsStyle="success"
              disabled={isEditingReservations}
              onClick={this.handleSave}
              type="submit"
            >
              {isEditingReservations ? 'Tallennetaan...' : 'Tallenna'}
            </Button>
          )}
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
  staffUnits: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationInfoModal,
    putReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationInfoModalSelector, mapDispatchToProps)(
  UnconnectedReservationInfoModal
);
