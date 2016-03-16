import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeReservationCancelModal } from 'actions/uiActions';
import TimeRange from 'components/common/TimeRange';
import reservationCancelModalSelector from 'selectors/containers/reservationCancelModalSelector';
import { getName } from 'utils/DataUtils';

export class UnconnectedReservationCancelModal extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.renderReservation = this.renderReservation.bind(this);
  }

  handleCancel() {
    this.props.actions.closeReservationCancelModal();
  }

  renderReservation(reservation) {
    const resource = this.props.resources[reservation.resource] || {};

    return (
      <li key={reservation.begin}>
        {getName(resource)}
        {': '}
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
    );
  }

  render() {
    const {
      actions,
      reservationsToCancel,
      show,
    } = this.props;

    return (
      <Modal
        onHide={actions.closeReservationCancelModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Varauksen perumisen vahvistus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>Oletko varma että haluat perua seuraavat varaukset?</strong></p>
          <ul>
            {map(reservationsToCancel, this.renderReservation)}
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationCancelModal}
          >
            Älä peruuta varausta
          </Button>
          <Button
            bsStyle="danger"
            onClick={this.handleCancel}
          >
            Peruuta varaus
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationCancelModal.propTypes = {
  actions: PropTypes.object.isRequired,
  reservationsToCancel: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCancelModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModal
);
