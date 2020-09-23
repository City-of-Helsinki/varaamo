import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import moment from 'moment';

import injectT from '../../i18n/injectT';
import ReservationInformation from '../../pages/reservation/reservation-information/ReservationInformation';
// eslint-disable-next-line max-len
import ResourceMultidayReservationCalendar from '../../../src/domain/resource/resourceMultidayReservationCalendar/ResourceMultidayReservationCalendar';
import { createNotification } from '../../../src/common/notification/utils';
import { NOTIFICATION_TYPE } from '../../../src/common/notification/constants';

class CreateMultidayReservationModal extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isPreliminaryReservation: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    selectedMultidaySlot: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { selection: { begin: undefined, end: undefined } };
  }

  onConfirm = (values) => {
    const {
      t, onConfirm, resource,
    } = this.props;
    const { begin, end } = this.state.selection;

    if (!begin || !end) {
      createNotification(
        NOTIFICATION_TYPE.ERROR,
        t('CreateMultidayReservationModal.error.invalidDate'),
      );
      return;
    }

    onConfirm({
      ...values,
      begin,
      end,
      resource: resource.id,
    });
    this.handleCancel();
  };

  getModalTitle = (isPreliminaryReservation, t) => {
    if (isPreliminaryReservation) {
      return t('ConfirmReservationModal.preliminaryReservationTitle');
    }
    return t('ConfirmReservationModal.regularReservationTitle');
  };

  handleCancel = () => {
    const { onCancel, onClose } = this.props;
    onCancel();
    onClose();
  };

  renderInfoTexts = () => {
    const { isPreliminaryReservation, t } = this.props;
    if (!isPreliminaryReservation) return null;

    return (
      <div>
        <p>{t('ConfirmReservationModal.priceInfo')}</p>
        <p>{t('ConfirmReservationModal.formInfo')}</p>
      </div>
    );
  };

  render = () => {
    const {
      isAdmin,
      isPreliminaryReservation,
      isMakingReservations,
      onClose,
      resource,
      show,
      t,
      isStaff,
      selectedMultidaySlot,
    } = this.props;

    return (
      <Modal
        animation={false}
        backdrop="static"
        className="app-ConfirmReservationModal modal-city-theme"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getModalTitle(isPreliminaryReservation, t)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderInfoTexts()}
          <ResourceMultidayReservationCalendar
            date={moment(selectedMultidaySlot.begin).toISOString()}
            lengthType={
              selectedMultidaySlot.reservationPeriod.reservationLengthType
            }
            onDateChange={() => {}}
            onSelectedRangeChange={(range) => {
              this.setState({
                selection: {
                  begin: moment(range.from).toISOString(),
                  end: moment(range.to).toISOString(),
                },
              });
            }}
            resource={resource}
          />
          <ReservationInformation
            isAdmin={isAdmin}
            isEditing={false}
            isMakingReservations={isMakingReservations}
            isStaff={isStaff}
            onBack={this.handleCancel}
            onCancel={this.handleCancel}
            onConfirm={this.onConfirm}
            openResourceTermsModal={() => {}}
            reservation={{}}
            resource={resource}
            selectedTime={this.state.selection}
            unit={{}}
          />
        </Modal.Body>
      </Modal>
    );
  };
}

export default injectT(CreateMultidayReservationModal);
