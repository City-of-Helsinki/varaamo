import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Modal from 'react-bootstrap/lib/Modal';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationInfoModal } from 'actions/uiActions';
import { commentReservation } from 'actions/reservationActions';
import ReservationStateLabel from 'shared/reservation-state-label';
import TimeRange from 'shared/time-range';
import { getName } from 'utils/translationUtils';
import reservationInfoModalSelector from './reservationInfoModalSelector';

export class UnconnectedReservationInfoModalContainer extends Component {
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
    const { actions, reservation, resource } = this.props;
    const comments = findDOMNode(this.refs.commentsInput).value;
    actions.commentReservation(reservation, resource, comments);
    actions.closeReservationInfoModal();
  }

  renderModalContent(reservation, resource, isAdmin, isStaff) {
    if (isEmpty(reservation)) {
      return null;
    }

    return (
      <div>
        <ReservationStateLabel reservation={reservation} />
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
          {reservation.accessCode && (
            <span>
              <dt>PIN-koodi:</dt>
              <dd>{reservation.accessCode}</dd>
            </span>
          )}
          {isAdmin && reservation.state === 'cancelled' && (
            <span>
              <dt>Kommentit:</dt>
              <dd>{reservation.comments}</dd>
            </span>
          )}
        </dl>
        {isAdmin && reservation.state !== 'cancelled' && (
          <form>
            <FormGroup controlId="commentsTextarea">
              <ControlLabel>Kommentit:</ControlLabel>
              <FormControl
                componentClass="textarea"
                defaultValue={reservation.comments}
                placeholder="Varauksen mahdolliset lisätiedot"
                ref="commentsInput"
                rows={5}
              />
            </FormGroup>
          </form>
        )}
      </div>
    );
  }

  render() {
    const {
      actions,
      isAdmin,
      isEditingReservations,
      reservation,
      resource,
      show,
      staffUnits,
    } = this.props;

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

UnconnectedReservationInfoModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditingReservations: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  staffUnits: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationInfoModal,
    commentReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationInfoModalSelector, mapDispatchToProps)(
  UnconnectedReservationInfoModalContainer
);
