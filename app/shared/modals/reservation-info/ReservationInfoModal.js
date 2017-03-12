import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Modal from 'react-bootstrap/lib/Modal';
import { findDOMNode } from 'react-dom';

import { injectT } from 'i18n';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationStateLabel from 'shared/reservation-state-label';
import ReservationEditForm from './ReservationEditForm';

class ReservationInfoModal extends Component {
  constructor(props) {
    super(props);
    this.handleSaveCommentsClick = this.handleSaveCommentsClick.bind(this);
  }

  handleSaveCommentsClick() {
    const comments = findDOMNode(this.refs.commentsInput).value;
    this.props.onSaveCommentsClick(comments);
  }

  render() {
    const {
      hideReservationInfoModal,
      isAdmin,
      isSaving,
      isStaff,
      onCancelClick,
      onConfirmClick,
      onDenyClick,
      reservation,
      reservationIsEditable,
      resource,
      show,
      t,
    } = this.props;

    const showCancelButton = reservationIsEditable && (
      reservation.state === 'confirmed' ||
      (reservation.state === 'requested' && !isAdmin)
    );

    return (
      <Modal
        className="reservation-info-modal"
        onHide={hideReservationInfoModal}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('ReservationInfoModal.title')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!isEmpty(reservation) &&
            <div>
              <ReservationStateLabel reservation={reservation} />
              <ReservationEditForm
                initialValues={reservation}
                isEditing={false}
                isStaff={isStaff}
                reservation={reservation}
                resource={resource}
                showComments={isAdmin && !reservationIsEditable}
              />
              {isAdmin && reservationIsEditable && (
                <form className="comments-form">
                  <FormGroup controlId="commentsTextarea">
                    <ControlLabel>{t('common.commentsLabel')}:</ControlLabel>
                    <FormControl
                      componentClass="textarea"
                      defaultValue={reservation.comments}
                      placeholder={t('common.commentsPlaceholder')}
                      ref="commentsInput"
                      rows={5}
                    />
                  </FormGroup>
                  <div className="form-controls">
                    <Button
                      bsStyle="primary"
                      disabled={isSaving}
                      onClick={this.handleSaveCommentsClick}
                    >
                      {isSaving ? t('common.saving') : t('ReservationInfoModal.saveComment')}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={hideReservationInfoModal}
          >
            {t('common.back')}
          </Button>
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="danger"
              disabled={isSaving}
              onClick={onDenyClick}
            >
              {t('ReservationInfoModal.denyButton')}
            </Button>
          )}
          {isStaff && reservationIsEditable && reservation.state === 'requested' && (
            <Button
              bsStyle="success"
              disabled={isSaving}
              onClick={onConfirmClick}
            >
              {t('ReservationInfoModal.confirmButton')}
            </Button>
          )}
          {showCancelButton && (
            <Button
              bsStyle="danger"
              disabled={isSaving}
              onClick={onCancelClick}
            >
              {t('ReservationInfoModal.cancelButton')}
            </Button>
          )}
        </Modal.Footer>
        <ReservationCancelModal />
      </Modal>
    );
  }
}

ReservationInfoModal.propTypes = {
  hideReservationInfoModal: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onSaveCommentsClick: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationInfoModal);
