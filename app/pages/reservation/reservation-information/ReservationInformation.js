import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import moment from 'moment';

import injectT from '../../../i18n/injectT';
import { isStaffEvent } from '../../../utils/reservationUtils';
import { getTermsAndConditions } from '../../../utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';
import RecurringReservationControls from '../../../shared/recurring-reservation-controls/RecurringReservationControls';
import CompactReservationList from '../../../shared/compact-reservation-list/CompactReservationList';

class ReservationInformation extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isPreliminaryReservation: PropTypes.bool.isRequired,
    onRemoveReservation: PropTypes.func.isRequired,
    recurringReservations: PropTypes.array.isRequired,
    selectedReservations: PropTypes.array.isRequired,
    isStaff: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    openResourceTermsModal: PropTypes.func.isRequired,
    reservation: PropTypes.object,
    resource: PropTypes.object.isRequired,
    selectedTime: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
  };

  onConfirm = (values) => {
    const { onConfirm } = this.props;
    onConfirm(values);
  }

  getFormFields = (termsAndConditions) => {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    const formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

    if (isAdmin) {
      formFields.push('comments');

      /* waiting for backend implementation */
      // formFields.push('reserverName');
      // formFields.push('reserverEmailAddress');
      // formFields.push('reserverPhoneNumber');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservation,
      resource,
    } = this.props;
    let rv = reservation ? pick(reservation, this.getFormFields()) : {};
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    }
    return rv;
  }

  getRequiredFormFields(resource, termsAndConditions) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    if (termsAndConditions) {
      requiredFormFields.push('termsAndConditions');
    }

    return requiredFormFields;
  }

  renderInfoTexts = () => {
    const { resource, t } = this.props;
    if (!resource.needManualConfirmation) return null;

    return (
      <div className="app-ReservationInformation__info-texts">
        <p>{t('ConfirmReservationModal.priceInfo')}</p>
        <p>{t('ConfirmReservationModal.formInfo')}</p>
      </div>
    );
  }

  renderReservationTimes = () => {
    const {
      isPreliminaryReservation,
      onRemoveReservation,
      recurringReservations,
      selectedReservations,
      t,
    } = this.props;

    const reservationsCount = selectedReservations.length + recurringReservations.length;
    const introText = isPreliminaryReservation
      ? t('ConfirmReservationModal.preliminaryReservationText', { reservationsCount })
      : t('ConfirmReservationModal.regularReservationText', { reservationsCount });

    return (
      <div>
        <p><strong>{introText}</strong></p>
        <CompactReservationList
          onRemoveClick={onRemoveReservation}
          removableReservations={recurringReservations}
          reservations={selectedReservations}
        />
      </div>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      onBack,
      onCancel,
      openResourceTermsModal,
      resource,
      selectedTime,
      t,
      unit,
    } = this.props;

    const termsAndConditions = getTermsAndConditions(resource);
    const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
    const endText = moment(selectedTime.end).format('HH:mm');
    const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

    return (
      <div className="app-ReservationInformation">
        <Row>
          <Col md={12} sm={12}>
            {this.renderInfoTexts()}
            <RecurringReservationControls />

            {this.renderReservationTimes()}
          </Col>
        </Row>
        <Row>
          <Col md={7} sm={12}>
            <ReservationInformationForm
              fields={this.getFormFields(termsAndConditions)}
              initialValues={this.getFormInitialValues()}
              isEditing={isEditing}
              isMakingReservations={isMakingReservations}
              onBack={onBack}
              onCancel={onCancel}
              onConfirm={this.onConfirm}
              openResourceTermsModal={openResourceTermsModal}
              requiredFields={this.getRequiredFormFields(resource, termsAndConditions)}
              resource={resource}
              termsAndConditions={termsAndConditions}
            />
          </Col>
          <Col md={5} sm={12}>
            <Well className="app-ReservationDetails">
              <h3>{t('ReservationPage.detailsTitle')}</h3>
              <Row>
                <Col className="app-ReservationDetails__label" md={4}>
                  {t('common.resourceLabel')}
                </Col>
                <Col className="app-ReservationDetails__value" md={8}>
                  {resource.name}
                  <br />
                  {unit.name}
                </Col>
              </Row>
              <Row>
                <Col className="app-ReservationDetails__label" md={4}>
                  {t('ReservationPage.detailsTime')}
                </Col>
                <Col className="app-ReservationDetails__value" md={8}>
                  {`${beginText}–${endText} (${hours} h)`}
                </Col>
              </Row>
            </Well>
          </Col>
        </Row>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
