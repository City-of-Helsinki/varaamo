import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';
import { Notification } from 'hds-react';

import TermsField from '../../../shared/form-fields/TermsField';
import constants from '../../../constants/AppConstants';
import FormTypes from '../../../constants/FormTypes';
import ReservationMetadataField from './ReservationMetadataField';
import injectT from '../../../i18n/injectT';
import { hasProducts } from '../../../utils/resourceUtils';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import InternalReservationFields from './InternalReservationFields';
import { toCamelCase } from '../../../../src/common/data/utils';
import { INPUT_PURPOSES } from '../../../../src/constants/InputPurposes';

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
  },
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
  comments: 1500,
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
  return errors;
}

class UnconnectedReservationInformationForm extends Component {
  getAsteriskExplanation = () => {
    const { resource, t } = this.props;
    const maybeBillable = resource.minPricePerHour && resource.maxPricePerHour;
    if (resource.needManualConfirmation && maybeBillable) {
      return `${t('ConfirmReservationModal.priceInfo')} ${t('ReservationForm.reservationFieldsAsteriskManualBilling')}`;
    }
    if (resource.needManualConfirmation && !hasProducts(resource)) {
      return t('ReservationForm.reservationFieldsAsteriskManualBilling');
    }
    if (!resource.needManualConfirmation && hasProducts(resource)) {
      return t('ReservationForm.reservationFieldsAsteriskNormal');
    }
    return t('ReservationForm.reservationFieldsAsteriskNormal');
  };

  renderField(name, type, label, help = null, extraProps = {}) {
    const { autoComplete, externalName } = extraProps;

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
        props={{
          autoComplete,
          externalName,
        }}
        type={type}
      />
    );
  }

  renderTermsField(name) {
    const { t, isStaff } = this.props;
    // eslint-disable-next-line max-len
    const label = `${t('ReservationInformationForm.termsAndConditionsLabel')} ${t('ReservationInformationForm.termsAndConditionsLink')}${isStaff ? '' : '*'}`;
    return (
      <Field
        component={TermsField}
        key={name}
        label={label}
        name={name}
        type="terms"
      />
    );
  }

  renderPaymentTermsField = () => {
    const { t, isStaff } = this.props;
    // eslint-disable-next-line max-len
    const label = `${t('ReservationInformationForm.paymentTermsAndConditionsLabel')} ${t('ReservationInformationForm.paymentTermsAndConditionsLink')}${isStaff ? '' : '*'}`;
    return (
      <Field
        component={TermsField}
        key="paymentTermsAndConditions"
        label={label}
        name="paymentTermsAndConditions"
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
      t,
      termsAndConditions,
      isStaff,
      valid,
    } = this.props;

    this.requiredFields = isStaff
      ? constants.REQUIRED_STAFF_EVENT_FIELDS
      : requiredFields;

    return (
      <div>
        <Form className="reservation-form reservation-form-top-bottom" horizontal noValidate>
          {
            /**
             * Naming is a bit misleading in this case.
             * See: <root>/varaamo/app/state/selectors/authSelectors.js
             * isAdminSelector returns actually isStaff
             * and createIsStaffSelector returns isAdmin
             */
            isStaff && (
            <InternalReservationFields
              commentsMaxLengths={maxLengths.comments}
              valid={valid}
            />
            )
          }
          <p>
            {this.getAsteriskExplanation()}
          </p>
          {includes(fields, 'reservationExtraQuestions')
          && this.renderField(
            'reservationExtraQuestions',
            'textarea',
            t('common.reservationExtraQuestions'),
            { rows: 5 },
          )
          }
          { includes(fields, 'reserverName') && (
            <h2 className="app-ReservationPage__title">
              {t('ReservationInformationForm.reserverInformationTitle')}
            </h2>
          )}
          {this.renderField(
            'reserverName',
            'text',
            t('common.reserverNameLabel'),
            null,
            { autoComplete: INPUT_PURPOSES.NAME, externalName: 'name' },
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
            null,
            { autoComplete: INPUT_PURPOSES.TEL, externalName: 'phone' },
          )}
          {this.renderField(
            'reserverEmailAddress',
            'email',
            t('common.reserverEmailAddressLabel'),
            null,
            { autoComplete: INPUT_PURPOSES.EMAIL, externalName: 'email' },
          )}
          {includes(fields, 'reserverAddressStreet')
            && this.renderField(
              'reserverAddressStreet',
              'text',
              t('common.addressStreetLabel'),
              null,
              { autoComplete: INPUT_PURPOSES.STREET_ADDRESS, externalName: 'address' },
            )}
          {includes(fields, 'reserverAddressZip')
            && this.renderField(
              'reserverAddressZip',
              'text',
              t('common.addressZipLabel'),
              null,
              { autoComplete: INPUT_PURPOSES.POSTAL_CODE, externalName: 'zip' },
            )}
          {includes(fields, 'reserverAddressCity')
            && this.renderField(
              'reserverAddressCity',
              'text',
              t('common.addressCityLabel'),
              null,
              { autoComplete: INPUT_PURPOSES.ADDRESS_LEVEL_2, externalName: 'city' },
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
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.STREET_ADDRESS].join(' '), externalName: 'billing-address' },
            )
          }
          {includes(fields, 'billingAddressZip')
            && this.renderField(
              'billingAddressZip',
              'text',
              t('common.addressZipLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.POSTAL_CODE].join(' '), externalName: 'billing-zip' },
            )
          }
          {includes(fields, 'billingAddressCity')
            && this.renderField(
              'billingAddressCity',
              'text',
              t('common.addressCityLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.ADDRESS_LEVEL_2].join(' '), externalName: 'billing-city' },
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
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.GIVEN_NAME].join(' '), externalName: 'billing-fname' },
            )
          }
          {includes(fields, 'billingLastName')
            && this.renderField(
              'billingLastName',
              'text',
              t('common.billingLastNameLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.FAMILY_NAME].join(' '), externalName: 'billing-lname' },
            )
          }
          {includes(fields, 'billingPhoneNumber')
            && this.renderField(
              'billingPhoneNumber',
              'tel',
              t('common.billingPhoneNumberLabel'),
              null,
              {
                autoComplete: ['billing', INPUT_PURPOSES.TEL].join(' '),
                externalName: ['billing', INPUT_PURPOSES.TEL].join('-'),
              },
            )
          }
          {includes(fields, 'billingEmailAddress')
            && this.renderField(
              'billingEmailAddress',
              'email',
              t('common.billingEmailAddressLabel'),
              null,
              {
                autoComplete: ['billing', INPUT_PURPOSES.EMAIL].join(' '),
                externalName: ['billing', INPUT_PURPOSES.EMAIL].join('-'),
              },
            )
          }
          <h2 className="app-ReservationPage__title">{t('ReservationInformationForm.eventInformationTitle')}</h2>
          {includes(fields, 'eventSubject') && (
            <Notification
              closeButtonLabelText="dismiss"
              labelText={t('ReservationForm.publicFieldsNoticeLabel')}
              onClose={() => {}}
              type="warning"
            >
              {t('ReservationForm.publicFieldsNotice')}
            </Notification>
          )}
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
            { rows: 5 },
          )}
          {this.renderField(
            'numberOfParticipants',
            'number',
            t('common.numberOfParticipantsLabel'),
            { min: '0' },
          )}
          {termsAndConditions
          && (
          <React.Fragment>
            <h2 className="app-ReservationPage__title">{t('ReservationTermsModal.resourceTermsTitle')}</h2>
            <div className="terms-box">
              <WrappedText text={resource.genericTerms} />
            </div>
            {this.renderTermsField('termsAndConditions')}
          </React.Fragment>
          )
          }
          {includes(fields, 'paymentTermsAndConditions')
            && (
            <React.Fragment>
              <h2 className="app-ReservationPage__title">{t('paymentTerms.title')}</h2>
              <div className="terms-box">
                <WrappedText text={resource.paymentTerms} />
              </div>
              {this.renderPaymentTermsField()}
            </React.Fragment>
            )
          }
          {resource.specificTerms && (
            <div>
              <h2 className="app-ReservationPage__title">{t('ReservationForm.specificTermsTitle')}</h2>
              <WrappedText className="specificTermsContent" text={resource.specificTerms} />
            </div>
          )}
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
            {hasProducts(resource) && !isStaff
              ? this.renderPayButton()
              : this.renderSaveButton()
            }
          </div>
        </Form>
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
  requiredFields: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
  isStaff: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };

// eslint-disable-next-line import/no-mutable-exports
let ConnectedReservationInformationForm = UnconnectedReservationInformationForm;

ConnectedReservationInformationForm = injectT(reduxForm({
  form: FormTypes.RESERVATION,
})(ConnectedReservationInformationForm));

ConnectedReservationInformationForm = connect(
  (state) => {
    const resource = state.ui.reservations.toEdit.length > 0
      ? state.ui.reservations.toEdit[0].resource
      : state.ui.reservations.selected[0].resource;

    return {
      initialValues: {
        internalReservation: true,
        reservationExtraQuestionsDefault: state.data.resources[resource].reservationExtraQuestions,
        reservationExtraQuestions: state.data.resources[resource].reservationExtraQuestions,
        ...toCamelCase(state.ui.reservations.toEdit[0]),
      },
      onChange: (obj) => {
        /**
         * We separate creating new reservation and editing existing reservation with !obj.resource check.
         * If we clear reservationExtraQuestions in the first place default reservationExtraQuestions is returned.
         * We can override default value when editing existing reservation.
         */
        if (obj.reservationExtraQuestions === '' && !obj.resource) {
          // eslint-disable-next-line no-param-reassign
          obj.reservationExtraQuestions = obj.reservationExtraQuestionsDefault;
        }
      },
      validate,
    };
  },
)(ConnectedReservationInformationForm);

export default ConnectedReservationInformationForm;
