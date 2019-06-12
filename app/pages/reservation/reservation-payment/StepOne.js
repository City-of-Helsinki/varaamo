import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';
import compose from 'lodash/flow';

import FormTypes from '../../../constants/FormTypes';
import injectT from '../../../i18n/injectT';


const requiredValidator = value => (value ? undefined : 'validation.required');

/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
const RequiredField = ({ component, ...otherProps }) => (
  <Field {...otherProps} component={component} required validate={[requiredValidator]} />
);

const Error = ({ error }) => (
  <span className="StepOne--error">{error}</span>
);

const Input = ({
  input,
  meta: { error, touched },
  t,
  label,
  ...otherProps,
}) => (
  <div className="StepOne--input">
    <label>
      {`${label} *`}
      <input {...input} {...otherProps} />
    </label>
    {touched && error && <Error error={t(error)} />}
  </div>
);

const Textarea = ({
  input,
  meta: { error, touched },
  t,
  label,
}) => (
  <div className="StepOne--input">
    <label>
      {`${label} *`}
      <textarea {...input} required />
    </label>
    {touched && error && <Error error={t(error)} />}
  </div>
);

const Terms = ({
  input,
  meta: { error, touched },
  t,
  labelId,
  link,
}) => (
  <div className="StepOne--terms">
    <label>
      <input {...input} type="checkbox" />
      <FormattedHTMLMessage id={labelId} values={{ link }} />
    </label>
    {touched && error && <Error error={t(error)} />}
  </div>
);

const FormActions = ({
  accepted,
  rejected,
  rejectText,
  acceptText,
  isSubmitEnabled,
}) => (
  <div>
    <Button bsSize="large" onClick={rejected} type="button">{rejectText}</Button>
    <Button bsSize="large" bsStyle="primary" disabled={!isSubmitEnabled} onClick={accepted}>{acceptText}</Button>
  </div>
);
/* eslint-enable react/prop-types */
/* eslint-enable jsx-a11y/label-has-associated-control */

class StepOne extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    valid: PropTypes.bool,
  };

  submit = () => {
    const { onSubmit } = this.props;
    onSubmit();
  }

  cancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { t, valid: isFormValid } = this.props;
    return (
      <form className="reservation-payment-StepOne" noValidate>
        <p>{t('reservationPayment.formAsterisk')}</p>
        <h2>{t('reservationPayment.formTitle')}</h2>
        <RequiredField component={Input} label={t('common.firstName')} name="firstName" t={t} />
        <RequiredField component={Input} label={t('common.lastName')} name="lastName" t={t} />
        <RequiredField component={Input} label={t('common.reserverEmailAddressLabel')} name="email" t={t} type="email" />
        <RequiredField component={Input} label={t('common.reserverPhoneNumberLabel')} name="phone" t={t} type="tel" />
        <h2>{t('reservationPayment.eventInformation')}</h2>
        <RequiredField component={Textarea} label={t('common.eventDescriptionLabel')} name="description" t={t} />
        <RequiredField component={Input} label={t('common.numberOfParticipantsLabel')} min="0" name="participants" t={t} type="number" />
        <RequiredField component={Terms} labelId="reservationPayment.acceptPremiseRegulations" link="/" name="premiseTerms" t={t} />
        <RequiredField component={Terms} labelId="reservationPayment.acceptPaymentTerms" link="/" name="paymentTerms" t={t} />
        <FormActions
          accepted={this.submit}
          acceptText={t('reservationPayment.pay')}
          isSubmitEnabled={isFormValid}
          rejected={this.cancel}
          rejectText={t('common.cancel')}
        />
      </form>
    );
  }
}

export default compose(
  reduxForm({
    form: FormTypes.RESERVATION_PAYMENT,
  }),
  injectT,
)(StepOne);
