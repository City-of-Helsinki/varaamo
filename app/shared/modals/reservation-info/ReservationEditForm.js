import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Well from 'react-bootstrap/lib/Well';
import { Field, Fields, reduxForm } from 'redux-form';

import FormTypes from 'constants/FormTypes';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import ReservationTimeControls from 'shared/form-fields/ReservationTimeControls';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';

class UnconnectedReservationEditForm extends Component {
  constructor(props) {
    super(props);
    this.renderAddressRow = this.renderAddressRow.bind(this);
    this.renderEditableInfoRow = this.renderEditableInfoRow.bind(this);
    this.renderInfoRow = this.renderInfoRow.bind(this);
    this.renderReservationTime = this.renderReservationTime.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  renderAddressRow(addressType) {
    const { reservation, t } = this.props;
    const hasAddress = (
      reservation.reserverAddressStreet || reservation.reserverAddressStreet === ''
    );
    if (!hasAddress) return null;
    const label = t(`common.${addressType}Label`);
    const value = this.getAddress(
      reservation[`${addressType}Street`],
      reservation[`${addressType}Zip`],
      reservation[`${addressType}City`]
    );
    return this.renderInfoRow(label, value);
  }

  renderInfoRow(label, value) {
    if (!value && value !== '') return null;
    return (
      <FormGroup>
        <Col sm={3}>
          <ControlLabel>{label}</ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl.Static>{value}</FormControl.Static>
        </Col>
      </FormGroup>
    );
  }

  renderEditableInfoRow(propertyName, type) {
    const { isEditing, reservation, t } = this.props;
    if (!isEditing) return this.renderStaticInfoRow(propertyName);
    const property = reservation[propertyName];
    if (!property && property !== '') return null;
    return (
      <Field
        component={ReduxFormField}
        controlProps={{}}
        label={t(`common.${propertyName}Label`)}
        name={propertyName}
        type={type}
      />
    );
  }

  renderStaticInfoRow(propertyName) {
    const { reservation, t } = this.props;
    const value = reservation[propertyName];
    const label = t(`common.${propertyName}Label`);
    return this.renderInfoRow(label, value);
  }

  renderUserInfoRow(userPropertyName, labelName) {
    const { reservation, t } = this.props;
    const user = reservation.user || {};
    const value = user[userPropertyName];
    const label = t(`common.${labelName}Label`);
    return this.renderInfoRow(label, value);
  }

  renderReservationTime() {
    const { isEditing, reservation, resource, t } = this.props;
    if (isEditing) {
      return (
        <FormGroup id="reservation-time">
          <Col sm={3}>
            <ControlLabel>{t('common.reservationTimeLabel')}</ControlLabel>
          </Col>
          <Col sm={9}>
            <Fields
              component={ReservationTimeControls}
              names={['begin', 'end']}
              period={resource.minPeriod}
            />
          </Col>
        </FormGroup>
      );
    }
    const staticReservationTime = <TimeRange begin={reservation.begin} end={reservation.end} />;
    return this.renderInfoRow(t('common.reservationTimeLabel'), staticReservationTime);
  }

  render() {
    const {
      handleSubmit,
      isAdmin,
      isEditing,
      isSaving,
      isStaff,
      onCancelEditClick,
      onStartEditClick,
      reservation,
      reservationIsEditable,
      resource,
      t,
    } = this.props;

    if (isEmpty(reservation)) return <span />;

    return (
      <Form
        className={classNames('reservation-edit-form', { editing: isEditing })}
        horizontal
        onSubmit={handleSubmit}
      >
        <Well>
          {this.renderUserInfoRow('displayName', 'userName')}
          {this.renderUserInfoRow('email', 'userEmail')}
        </Well>
        {this.renderEditableInfoRow('eventSubject', 'text')}
        {this.renderStaticInfoRow('reserverName')}
        {this.renderEditableInfoRow('eventDescription', 'textarea')}
        {this.renderEditableInfoRow('numberOfParticipants', 'number')}
        {this.renderReservationTime()}
        {this.renderInfoRow(t('common.resourceLabel'), resource.name)}

        {isStaff && this.renderStaticInfoRow('reserverId')}
        {this.renderStaticInfoRow('reserverPhoneNumber')}
        {this.renderStaticInfoRow('reserverEmailAddress')}
        {this.renderAddressRow('reserverAddress')}
        {this.renderAddressRow('billingAddress')}
        {this.renderStaticInfoRow('accessCode')}
        {isAdmin && !reservationIsEditable && this.renderStaticInfoRow('comments')}
        {isAdmin && reservationIsEditable && (
          <div className="form-controls">
            {!isEditing && (
              <Button
                bsStyle="primary"
                disabled={isSaving}
                onClick={onStartEditClick}
              >
                {t('ReservationEditForm.startEdit')}
              </Button>
            )}
            {isEditing && (
              <Button
                bsStyle="default"
                disabled={isSaving}
                onClick={onCancelEditClick}
              >
                {t('ReservationEditForm.cancelEdit')}
              </Button>
            )}
            {isEditing && (
              <Button
                bsStyle="primary"
                disabled={isSaving}
                type="submit"
              >
                {t('ReservationEditForm.saveChanges')}
              </Button>
            )}
          </div>
        )}
      </Form>
    );
  }
}

UnconnectedReservationEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onCancelEditClick: PropTypes.func.isRequired,
  onStartEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedReservationEditForm = injectT(UnconnectedReservationEditForm);  // eslint-disable-line

export { UnconnectedReservationEditForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION_EDIT,
})(UnconnectedReservationEditForm));
