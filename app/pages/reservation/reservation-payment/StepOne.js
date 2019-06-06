import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';

import { injectT } from '../../../i18n';


/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
const Input = ({
  name,
  label,
  component = 'input',
  type = 'text',
}) => {
  /* eslint-disable no-param-reassign */
  if (component === 'textarea') {
    type = null;
  }
  return (
    <div className="StepOne-input-group">
      <label htmlFor={name}>{`${label} *`}</label>
      <Field component={component} id={name} name={name} required type={type} />
    </div>
  );
};

const Terms = ({
  name,
  msgId,
  link,
}) => (
  <div className="StepOne-terms">
    <Field component="input" id={name} name={name} required type="checkbox" />
    <FormattedHTMLMessage htmlFor={name} id={msgId} values={{ link }}>
      {txt => (
        // eslint-disable-next-line react/no-danger
        <label dangerouslySetInnerHTML={{ __html: txt }} htmlFor={name} />
      )}
    </FormattedHTMLMessage>
  </div>
);

const FormActions = ({
  accepted,
  rejected,
  rejectText,
  acceptText,
}) => (
  <div>
    <Button bsSize="large" onClick={rejected} type="button">{rejectText}</Button>
    <Button bsSize="large" bsStyle="primary" onClick={accepted} type="submit">{acceptText}</Button>
  </div>
);
/* eslint-enable react/prop-types */
/* eslint-enable jsx-a11y/label-has-associated-control */

class StepOne extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    onStepComplete: PropTypes.func,
  };

  submit = () => {
    const { onStepComplete } = this.props;
    onStepComplete();
  }

  cancel = () => {

  }

  render() {
    const { t } = this.props;
    return (
      <form className="reservation-payment-StepOne">
        <p>{t('reservationPayment.formAsterisk')}</p>
        <h2>{t('reservationPayment.formTitle')}</h2>
        <Input label={t('common.firstName')} name="firstName" />
        <Input label={t('common.lastName')} name="lastName" />
        <Input label={t('common.reserverEmailAddressLabel')} name="email" type="email" />
        <Input label={t('common.reserverPhoneNumberLabel')} name="phone" type="tel" />
        <h2>{t('reservationPayment.eventInformation')}</h2>
        <Input component="textarea" label={t('common.eventDescriptionLabel')} name="description" />
        <Input label={t('common.numberOfParticipantsLabel')} name="participants" type="number" />
        <Terms link="/" msgId="reservationPayment.acceptPremiseRegulations" name="premiseTerms" />
        <Terms link="/" msgId="reservationPayment.acceptPaymentTerms" name="paymentTerms" />
        <FormActions
          accepted={this.submit}
          acceptText={t('reservationPayment.pay')}
          rejected={this.cancel}
          rejectText={t('common.cancel')}
        />
      </form>
    );
  }
}

export default injectT(StepOne);
