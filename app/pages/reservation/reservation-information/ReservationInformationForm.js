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
import PaymentTermsModal from '../../../shared/modals/payment-terms/PaymentTermsModal';
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
  /**
   * Handling <ReservationInformationForm /> errors
   */
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
  /**
   * Handling <InternalReservationForm /> errors
   */
  internalReservationComments: 1500
};

function isTermsAndConditionsField(field) {
  return field === 'termsAndConditions'
    || field === 'paymentTermsAndConditions';
}

function getTermsAndConditionsError(field) {
  return field === 'paymentTermsAndConditions'
    ? 'ReservationForm.paymentTermsAndConditionsError'
    : 'ReservationForm.termsAndConditionsError';
}

export function validate(values, { fields, requiredFields, t }) {
  const errors = {};
  /**
   * Handling <ReservationInformationForm /> errors
   */
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
          isTermsAndConditionsField(field)
            ? t(getTermsAndConditionsError(field))
            : t('ReservationForm.requiredError')
        );
      }
    }
  });
  /**
   * Handling <InternalReservationForm /> errors
   */
  if (!values.internalReservation) {
    errors.internalReservation = 'Required';
  }
  if (values.internalReservationComments) {
    if (values.internalReservationComments.length > maxLengths.internalReservationComments) {
      errors.internalReservationComments = `Max length ${maxLengths.internalReservationComments}`;
    }
  }
  return errors;
}

class UnconnectedReservationInformationForm extends Component {
  state = {
    isPaymentTermsModalOpen: false,
  }

  closePaymentTermsModal = () => {
    this.setState({ isPaymentTermsModalOpen: false });
  }

  openPaymentTermsModal = () => {
    this.setState({ isPaymentTermsModalOpen: true });
  }

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

  renderPaymentTermsField = () => {
    const { t } = this.props;
    return (
      <Field
        component={TermsField}
        key="paymentTermsAndConditions"
        label={t('ReservationInformationForm.paymentTermsAndConditionsLabel')}
        labelLink={t('ReservationInformationForm.paymentTermsAndConditionsLink')}
        name="paymentTermsAndConditions"
        onClick={this.openPaymentTermsModal}
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
      fields,
      onBack,
      onCancel,
      requiredFields,
      resource,
      staffEventSelected,
      t,
      termsAndConditions,
      valid
    } = this.props;
    const {
      isPaymentTermsModalOpen,
    } = this.state;

    this.requiredFields = staffEventSelected
      ? constants.REQUIRED_STAFF_EVENT_FIELDS
      : requiredFields;

    return (
      <div>
        <Form className="reservation-form" horizontal noValidate>
          <p>
            {t('ReservationForm.reservationFieldsAsteriskExplanation')}
          </p>
          { includes(fields, 'reserverName') && (
            <h2 className="app-ReservationPage__title">
              {t('ReservationInformationForm.reserverInformationTitle')}
            </h2>
          )}
          { includes(fields, 'staffEvent') && (
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
          {includes(fields, 'reserverAddressStreet')
            && this.renderField(
              'reserverAddressStreet',
              'text',
              t('common.addressStreetLabel'),
            )}
          {includes(fields, 'reserverAddressZip')
            && this.renderField(
              'reserverAddressZip',
              'text',
              t('common.addressZipLabel'),
            )}
          {includes(fields, 'reserverAddressCity')
            && this.renderField(
              'reserverAddressCity',
              'text',
              t('common.addressCityLabel'),
            )
          }
          {includes(fields, 'billingAddressStreet')
            && <h2 className="app-ReservationPage__title">{t('common.billingAddressLabel')}</h2>
          }
          {includes(fields, 'billingAddressStreet')
            && this.renderField(
              'billingAddressStreet',
              'text',
              t('common.addressStreetLabel'),
            )
          }
          {includes(fields, 'billingAddressZip')
            && this.renderField(
              'billingAddressZip',
              'text',
              t('common.addressZipLabel'),
            )
          }
          {includes(fields, 'billingAddressCity')
            && this.renderField(
              'billingAddressCity',
              'text',
              t('common.addressCityLabel'),
            )
          }
          {includes(fields, 'billingFirstName')
            && <h2 className="app-ReservationPage__title">{t('common.paymentInformationLabel')}</h2>
          }
          {includes(fields, 'billingFirstName')
            && this.renderField(
              'billingFirstName',
              'text',
              t('common.billingFirstNameLabel'),
            )
          }
          {includes(fields, 'billingLastName')
            && this.renderField(
              'billingLastName',
              'text',
              t('common.billingLastNameLabel'),
            )
          }
          {includes(fields, 'billingPhoneNumber')
            && this.renderField(
              'billingPhoneNumber',
              'tel',
              t('common.billingPhoneNumberLabel'),
            )
          }
          {includes(fields, 'billingEmailAddress')
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
          {
            /**
             * TODO
             */
            termsAndConditions && valid ? '' : <pre>DEBUG: NOT VALID!!!</pre>
          }
          {resource.specificTerms && (
            <div>
              <h2 className="app-ReservationPage__title">{t('ReservationForm.specificTermsTitle')}</h2>
              <p className="specificTermsContent">{resource.specificTerms}</p>
            </div>
          )}
          {includes(fields, 'paymentTermsAndConditions')
            && this.renderPaymentTermsField()
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
        <PaymentTermsModal
          isOpen={isPaymentTermsModalOpen}
          onDismiss={this.closePaymentTermsModal}
        />
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
  valid: PropTypes.bool.isRequired
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  validate,
})(UnconnectedReservationInformationForm));
