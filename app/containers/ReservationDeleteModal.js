import map from 'lodash/collection/map';
import forEach from 'lodash/collection/forEach';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteReservation } from 'actions/reservationActions';
import { closeDeleteReservationModal } from 'actions/uiActions';
import TimeRange from 'components/common/TimeRange';
import reservationDeleteModalSelector from 'selectors/containers/reservationDeleteModalSelector';
import { getName } from 'utils/DataUtils';

export class UnconnectedReservationDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.renderReservation = this.renderReservation.bind(this);
  }

  handleDelete() {
    const { actions, reservationsToDelete } = this.props;

    forEach(reservationsToDelete, (reservation) => {
      actions.deleteReservation(reservation);
    });
    actions.closeDeleteReservationModal();
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
      isDeletingReservations,
      reservationsToDelete,
      show,
    } = this.props;

    return (
      <Modal
        onHide={actions.closeDeleteReservationModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Poistamisen vahvistus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>Oletko varma että haluat poistaa seuraavat varaukset?</strong></p>
          <ul>
            {map(reservationsToDelete, this.renderReservation)}
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeDeleteReservationModal}
          >
            Peruuta
          </Button>
          <Button
            bsStyle="danger"
            disabled={isDeletingReservations}
            onClick={this.handleDelete}
          >
            {isDeletingReservations ? 'Poistetaan...' : 'Poista'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationDeleteModal.propTypes = {
  actions: PropTypes.object.isRequired,
  isDeletingReservations: PropTypes.bool.isRequired,
  reservationsToDelete: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeDeleteReservationModal,
    deleteReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationDeleteModalSelector, mapDispatchToProps)(
  UnconnectedReservationDeleteModal
);
