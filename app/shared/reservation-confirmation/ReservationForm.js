import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Well from 'react-bootstrap/lib/Well';
import { Field, Fields, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';

import constants from 'constants/AppConstants';
import FormTypes from 'constants/FormTypes';
import WrappedText from 'shared/wrapped-text';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import { injectT } from 'i18n';
import TimeControls from './TimeControls';

const validators = {
  reserverEmailAddress: (t, { reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  },
};

const maxLengths = {
  billingAddressCity: 100,
  billingAddressStreet: 100,
  billingAddressZip: 30,
  company: 100,
  numberOfParticipants: 100,
  reserverAddressCity: 100,
  reserverAddressStreet: 100,
  reserverAddressZip: 30,
  reserverEmailAddress: 100,
  reserverId: 30,
  reserverName: 100,
  reserverPhoneNumber: 30,
};

export function validate(values, { fields, requiredFields, t }) {
  const errors = {};
  const currentRequiredFields = values.staffEvent ?
    constants.REQUIRED_STAFF_EVENT_FIELDS :
    requiredFields;
  fields.forEach((field) => {
    const validator = validators[field];
    if (validator) {
      const error = validator(t, values);
      if (error) {
        errors[field] = error;
      }
    }
    if (maxLengths[field]) {
      if (values[field] && values[field].length > maxLengths[field]) {
        errors[field] = t('ReservationForm.maxLengthError', { maxLength: maxLengths[field] });
      }
    }
    if (includes(currentRequiredFields, field)) {
      if (!values[field]) {
        errors[field] = (
          field === 'termsAndConditions' ?
          t('ReservationForm.termsAndConditionsError') :
          t('ReservationForm.requiredError')
        );
      }
    }
  });
  return errors;
}

class UnconnectedReservationForm extends Component {
  renderField(name, type, label, controlProps = {}, help = null, info = null) {
    if (!includes(this.props.fields, name)) {
      return null;
    }
    const isRequired = includes(this.requiredFields, name);

    return (
      <Field
        component={ReduxFormField}
        controlProps={controlProps}
        help={help}
        info={info}
        label={`${label}${isRequired ? '*' : ''}`}
        name={name}
        type={type}
      />
    );
  }

  renderTimeControls = () => {
    const { fields, maxReservationPeriod, t, timeSlots } = this.props;
    if (!includes(fields, 'begin') || !includes(fields, 'end')) {
      return null;
    }

    return (
      <FormGroup id="reservation-time">
        <Col sm={3}>
          <ControlLabel>{t('common.reservationTimeLabel')}</ControlLabel>
        </Col>
        <Col sm={9}>
          <Fields
            component={TimeControls}
            maxReservationPeriod={maxReservationPeriod}
            names={['begin', 'end']}
            timeSlots={timeSlots}
          />
        </Col>
      </FormGroup>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      handleSubmit,
      onCancel,
      onConfirm,
      requiredFields,
      staffEventSelected,
      t,
      termsAndConditions,
    } = this.props;

    this.requiredFields = staffEventSelected ?
      constants.REQUIRED_STAFF_EVENT_FIELDS :
      requiredFields;

    return (
      <div>
        <Form className="reservation-form" horizontal>
          {this.renderTimeControls()}
          { includes(this.props.fields, 'staffEvent') && (
            <Well>
              {this.renderField(
                'staffEvent',
                'checkbox',
                t('ReservationForm.staffEventLabel'),
                {},
                t('ReservationForm.staffEventHelp'),
              )}
            </Well>
          )}
          {this.renderField(
            'eventSubject',
            'text',
            t('common.eventSubjectLabel'),
            {},
            null,
            t('ReservationForm.eventSubjectInfo'),
          )}
          {this.renderField(
            'reserverName',
            'text',
            t('common.reserverNameLabel')
          )}
          {this.renderField(
            'reserverId',
            'text',
            t('common.reserverIdLabel')
          )}
          {this.renderField(
            'reserverPhoneNumber',
            'text',
            t('common.reserverPhoneNumberLabel')
          )}
          {this.renderField(
            'reserverEmailAddress',
            'email',
            t('common.reserverEmailAddressLabel')
          )}
          {this.renderField(
            'eventDescription',
            'textarea',
            t('common.eventDescriptionLabel'),
            { rows: 5 }
          )}
          {this.renderField(
            'numberOfParticipants',
            'number',
            t('common.numberOfParticipantsLabel'),
            { min: '0' }
          )}
          {includes(this.props.fields, 'reserverAddressStreet') && (
            <Well>
              <p>{t('common.reserverAddressLabel')}</p>
              {this.renderField(
                'reserverAddressStreet',
                'text',
                t('common.addressStreetLabel'),
              )}
              {this.renderField(
                'reserverAddressZip',
                'text',
                t('common.addressZipLabel'),
              )}
              {this.renderField(
                'reserverAddressCity',
                'text',
                t('common.addressCityLabel'),
              )}
            </Well>
          )}
          {includes(this.props.fields, 'billingAddressStreet') && (
            <Well>
              <p>{t('common.billingAddressLabel')}</p>
              {this.renderField(
                'billingAddressStreet',
                'text',
                t('common.addressStreetLabel'),
              )}
              {this.renderField(
                'billingAddressZip',
                'text',
                t('common.addressZipLabel'),
              )}
              {this.renderField(
                'billingAddressCity',
                'text',
                t('common.addressCityLabel'),
              )}
            </Well>
          )}
          {this.renderField(
            'comments',
            'textarea',
            t('common.commentsLabel'),
            {
              placeholder: t('common.commentsPlaceholder'),
              rows: 5,
            }
          )}
          {termsAndConditions && (
            <div className="terms-and-conditions">
              <h5>{t('ReservationForm.termsAndConditionsHeader')}</h5>
              <WrappedText text={termsAndConditions} />
            </div>
          )}
          {termsAndConditions && (
            <Well className="terms-and-conditions-input-wrapper">
              {this.renderField(
                'termsAndConditions',
                'checkbox',
                t('ReservationForm.termsAndConditionsLabel'),
              )}
            </Well>
          )}
          <div className="form-controls">
            <Button
              bsStyle="default"
              onClick={onCancel}
            >
              {isEditing ? t('common.cancel') : t('common.back')}
            </Button>
            <Button
              bsStyle="primary"
              disabled={isMakingReservations}
              onClick={handleSubmit(onConfirm)}
              type="submit"
            >
              {isMakingReservations ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  maxReservationPeriod: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  staffEventSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
  timeSlots: PropTypes.array,
};
UnconnectedReservationForm = injectT(UnconnectedReservationForm);  // eslint-disable-line

export { UnconnectedReservationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  validate,
})(UnconnectedReservationForm));
