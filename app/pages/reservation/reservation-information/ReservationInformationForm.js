import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Well from 'react-bootstrap/lib/Well';
import { Field, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';

import TermsField from '../../../shared/form-fields/TermsField';
import constants from '../../../constants/AppConstants';
import FormTypes from '../../../constants/FormTypes';
import ReservationMetadataField from './ReservationMetadataField';
import injectT from '../../../i18n/injectT';
import ReservationTermsModal from '../../../shared/modals/reservation-terms/ReservationTermsModal';
import { hasProducts } from '../../../utils/resourceUtils';

const validators = {
  reserverEmailAddress: (t, { reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  },
  billingEmailAddress: (t, { billingEmailAddress }) => {
    if (billingEmailAddress && !isEmail(billingEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  }
};

const maxLengths = {
  billingAddressCity: 100,
  billingAddressStreet: 100,
  billingAddressZip: 30,
  billingEmailAddress: 100,
  billingFirstName: 100,
  billingLastName: 100,
  billingPhoneNumber: 30,
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
  const currentRequiredFields = values.staffEvent
    ? constants.REQUIRED_STAFF_EVENT_FIELDS
    : requiredFields;
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
          field === 'termsAndConditions'
            ? t('ReservationForm.termsAndConditionsError')
            : t('ReservationForm.requiredError')
        );
      }
    }
  });
  return errors;
}

class UnconnectedReservationInformationForm extends Component {
  renderField(name, type, label, help = null) {
    if (!includes(this.props.fields, name)) {
      return null;
    }
    const isRequired = includes(this.requiredFields, name);

    return (
      <Field
        component={ReservationMetadataField}
        help={help}
        label={`${label}${isRequired ? '*' : ''}`}
        name={name}
        type={type}
      />
    );
  }

  renderTermsField(name) {
    const { openResourceTermsModal, t } = this.props;
    const label = t('ReservationInformationForm.termsAndConditionsLabel');
    const labelLink = `${t('ReservationInformationForm.termsAndConditionsLink')}`;
    return (
      <Field
        component={TermsField}
        key={name}
        label={label}
        labelLink={labelLink}
        name={name}
        onClick={openResourceTermsModal}
        type="terms"
      />
    );
  }

  renderSaveButton() {
    const {
      isMakingReservations,
      handleSubmit,
      onConfirm,
      t,
    } = this.props;
    return (
      <Button
        bsStyle="primary"
        disabled={isMakingReservations}
        onClick={handleSubmit(onConfirm)}
        type="submit"
      >
        {isMakingReservations ? t('common.saving') : t('common.save')}
      </Button>
    );
  }

  renderPayButton() {
    const {
      isMakingReservations,
      handleSubmit,
      onConfirm,
      t,
    } = this.props;
    return (
      <Button
        bsStyle="primary"
        disabled={isMakingReservations}
        onClick={handleSubmit(onConfirm)}
        type="submit"
      >
        {t('common.pay')}
      </Button>
    );
  }

  render() {
    const {
      isEditing,
      onBack,
      onCancel,
      requiredFields,
      resource,
      staffEventSelected,
      t,
      termsAndConditions,
    } = this.props;

    this.requiredFields = staffEventSelected
      ? constants.REQUIRED_STAFF_EVENT_FIELDS
      : requiredFields;

    return (
      <div>
        <Form className="reservation-form" horizontal noValidate>
          <p>
            {t('ReservationForm.reservationFieldsAsteriskExplanation')}
          </p>
          { includes(this.props.fields, 'reserverName') && (
            <h2 className="app-ReservationPage__title">
              {t('ReservationInformationForm.reserverInformationTitle')}
            </h2>
          )}
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
            'reserverName',
            'text',
            t('common.reserverNameLabel'),
          )}
          {this.renderField(
            'reserverId',
            'text',
            t('common.reserverIdLabel'),
          )}
          {this.renderField(
            'reserverPhoneNumber',
            'text',
            t('common.reserverPhoneNumberLabel'),
          )}
          {this.renderField(
            'reserverEmailAddress',
            'email',
            t('common.reserverEmailAddressLabel'),
          )}
          {includes(this.props.fields, 'reserverAddressStreet')
            && this.renderField(
              'reserverAddressStreet',
              'text',
              t('common.addressStreetLabel'),
            )}
          {includes(this.props.fields, 'reserverAddressZip')
            && this.renderField(
              'reserverAddressZip',
              'text',
              t('common.addressZipLabel'),
            )}
          {includes(this.props.fields, 'reserverAddressCity')
            && this.renderField(
              'reserverAddressCity',
              'text',
              t('common.addressCityLabel'),
            )
          }
          {includes(this.props.fields, 'billingAddressStreet')
            && <h2 className="app-ReservationPage__title">{t('common.billingAddressLabel')}</h2>
          }
          {includes(this.props.fields, 'billingAddressStreet')
            && this.renderField(
              'billingAddressStreet',
              'text',
              t('common.addressStreetLabel'),
            )
          }
          {includes(this.props.fields, 'billingAddressZip')
            && this.renderField(
              'billingAddressZip',
              'text',
              t('common.addressZipLabel'),
            )
          }
          {includes(this.props.fields, 'billingAddressCity')
            && this.renderField(
              'billingAddressCity',
              'text',
              t('common.addressCityLabel'),
            )
          }
          {includes(this.props.fields, 'billingFirstName')
            && <h2 className="app-ReservationPage__title">{t('common.paymentInformationLabel')}</h2>
          }
          {includes(this.props.fields, 'billingFirstName')
            && this.renderField(
              'billingFirstName',
              'text',
              t('common.billingFirstNameLabel'),
            )
          }
          {includes(this.props.fields, 'billingLastName')
            && this.renderField(
              'billingLastName',
              'text',
              t('common.billingLastNameLabel'),
            )
          }
          {includes(this.props.fields, 'billingPhoneNumber')
            && this.renderField(
              'billingPhoneNumber',
              'tel',
              t('common.billingPhoneNumberLabel'),
            )
          }
          {includes(this.props.fields, 'billingEmailAddress')
            && this.renderField(
              'billingEmailAddress',
              'email',
              t('common.billingEmailAddressLabel'),
            )
          }
          <h2 className="app-ReservationPage__title">{t('ReservationInformationForm.eventInformationTitle')}</h2>
          {this.renderField(
            'eventSubject',
            'text',
            t('common.eventSubjectLabel'),
            {},
            t('ReservationForm.eventSubjectInfo'),
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
          {this.renderField(
            'comments',
            'textarea',
            t('common.commentsLabel'),
            { rows: 5 }
          )}
          {termsAndConditions
            && this.renderTermsField('termsAndConditions')
          }
          <div>
            <Button
              onClick={onCancel}
            >
              {isEditing ? t('ReservationInformationForm.cancelEdit') : t('common.cancel')}
            </Button>
            {isEditing
              && (
              <Button
                bsStyle="default"
                onClick={onBack}
              >
                {t('common.previous')}
              </Button>
              )
            }
            {hasProducts(resource)
              ? this.renderPayButton()
              : this.renderSaveButton()
            }
          </div>
        </Form>
        <ReservationTermsModal resource={resource} />
      </div>
    );
  }
}

UnconnectedReservationInformationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  openResourceTermsModal: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  staffEventSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  validate,
})(UnconnectedReservationInformationForm));
