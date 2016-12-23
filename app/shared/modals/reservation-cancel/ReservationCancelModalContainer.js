import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteReservation } from 'actions/reservationActions';
import { closeReservationCancelModal } from 'actions/uiActions';
import CompactReservationList from 'shared/compact-reservation-list';
import { injectT } from 'i18n';
import reservationCancelModalSelector from './reservationCancelModalSelector';

class UnconnectedReservationCancelModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    const { actions, reservation } = this.props;
    actions.deleteReservation(reservation);
    actions.closeReservationCancelModal();
  }

  render() {
    const {
      actions,
      cancelAllowed,
      isCancellingReservations,
      reservation,
      resource,
      show,
      t,
    } = this.props;

    return (
      <Modal
        onHide={actions.closeReservationCancelModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {cancelAllowed ?
              t('ReservationCancelModal.cancelAllowedTitle') :
              t('ReservationCancelModal.cancelNotAllowedTitle')
            }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {cancelAllowed &&
            <div>
              <p><strong>{t('ReservationCancelModal.lead')}</strong></p>
              {reservation.resource &&
                <CompactReservationList
                  reservations={[reservation]}
                  resources={{ [resource.id]: resource }}
                />
              }
            </div>
          }
          {!cancelAllowed &&
            <div>
              <p>{t('ReservationCancelModal.cancelNotAllowedInfo')}</p>
              <p><FormattedHTMLMessage id="ReservationCancelModal.takeIntoAccount" /></p>
              <p className="responsible-contact-info">{resource.responsibleContactInfo}</p>
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={actions.closeReservationCancelModal}
          >
            {cancelAllowed ?
              t('ReservationCancelModal.cancelAllowedCancel') :
              t('common.back')
            }
          </Button>
          {cancelAllowed && (
            <Button
              bsStyle="danger"
              disabled={isCancellingReservations}
              onClick={this.handleCancel}
            >
              {isCancellingReservations ?
                t('common.cancelling') :
                t('ReservationCancelModal.cancelAllowedConfirm')
              }
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationCancelModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  cancelAllowed: PropTypes.bool.isRequired,
  isCancellingReservations: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedReservationCancelModalContainer = injectT(UnconnectedReservationCancelModalContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCancelModal,
    deleteReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationCancelModalContainer };
export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModalContainer
);
