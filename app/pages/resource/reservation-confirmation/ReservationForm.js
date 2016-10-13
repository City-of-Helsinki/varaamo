import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Well from 'react-bootstrap/lib/Well';
import { Field, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';

import WrappedText from 'shared/wrapped-text';
import constants from 'constants/AppConstants';
import ReduxFormField from 'shared/form-fields/ReduxFormField';

const validators = {
  reserverEmailAddress: ({ reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return 'Syötä kunnollinen sähköpostiosoite';
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

export function validate(values, { fields, requiredFields }) {
  const errors = {};
  const currentRequiredFields = values.staffEvent ?
    constants.REQUIRED_STAFF_EVENT_FIELDS :
    requiredFields;
  fields.forEach((field) => {
    const validator = validators[field];
    if (validator) {
      const error = validator(values);
      if (error) {
        errors[field] = error;
      }
    }
    if (maxLengths[field]) {
      if (values[field] && values[field].length > maxLengths[field]) {
        errors[field] = `Kentän maksimipituus on ${maxLengths[field]} merkkiä`;
      }
    }
    if (includes(currentRequiredFields, field)) {
      if (!values[field]) {
        errors[field] = (
          field === 'termsAndConditions' ?
          'Sinun on hyväksyttävä tilan käyttösäännöt varataksesi tilan' :
          'Pakollinen tieto'
        );
      }
    }
  });
  return errors;
}

export class UnconnectedReservationForm extends Component {
  renderField(name, type, label, controlProps = {}, help = null) {
    if (!includes(this.props.fields, name)) {
      return null;
    }
    const isRequired = includes(this.requiredFields, name);

    return (
      <Field
        component={ReduxFormField}
        controlProps={controlProps}
        help={help}
        label={`${label}${isRequired ? '*' : ''}`}
        name={name}
        type={type}
      />
    );
  }

  render() {
    const {
      isMakingReservations,
      handleSubmit,
      onClose,
      onConfirm,
      requiredFields,
      staffEventSelected,
      termsAndConditions,
    } = this.props;

    this.requiredFields = staffEventSelected ?
      constants.REQUIRED_STAFF_EVENT_FIELDS :
      requiredFields;

    return (
      <div>
        <Form className="reservation-form" horizontal>
          { includes(this.props.fields, 'staffEvent') && (
            <Well>
              {this.renderField(
                'staffEvent',
                'checkbox',
                'Viraston oma tapahtuma',
                {},
                `Viraston oma tapahtuma hyväksytään automaattisesti ja ainoat pakolliset
                tiedot ovat varaajan nimi ja tilaisuuden kuvaus.`,
              )}
            </Well>
          )}
          {this.renderField('reserverName', 'text', 'Varaaja / vuokraaja')}
          {this.renderField('reserverId', 'text', 'Y-tunnus / henkilötunnus')}
          {this.renderField('reserverPhoneNumber', 'text', 'Puhelin')}
          {this.renderField('reserverEmailAddress', 'email', 'Sähköposti')}
          {this.renderField('eventDescription', 'textarea', 'Tilaisuuden kuvaus', { rows: 5 })}
          {this.renderField(
            'numberOfParticipants',
            'number',
            'Osallistujamäärä',
            { min: '0' }
          )}
          { includes(this.props.fields, 'reserverAddressStreet') && (
            <Well>
              <p>Osoite</p>
              {this.renderField('reserverAddressStreet', 'text', 'Katuosoite')}
              {this.renderField('reserverAddressZip', 'text', 'Postinumero')}
              {this.renderField('reserverAddressCity', 'text', 'Kaupunki')}
            </Well>
          )}
          { includes(this.props.fields, 'billingAddressStreet') && (
            <Well>
              <p>Laskutusosoite</p>
              {this.renderField('billingAddressStreet', 'text', 'Katuosoite')}
              {this.renderField('billingAddressZip', 'text', 'Postinumero')}
              {this.renderField('billingAddressCity', 'text', 'Kaupunki')}
            </Well>
          )}
          {this.renderField(
            'comments',
            'textarea',
            'Kommentit',
            {
              placeholder: 'Varauksen mahdolliset lisätiedot',
              rows: 5,
            }
          )}
          {termsAndConditions && (
            <div className="terms-and-conditions">
              <h5>Tilan käyttösäännöt</h5>
              <WrappedText text={termsAndConditions} />
            </div>
          )}
          {termsAndConditions && (
            <Well className="terms-and-conditions-input-wrapper">
              {this.renderField(
                'termsAndConditions',
                'checkbox',
                'Olen lukenut ja hyväksynyt tilan käyttösäännöt',
              )}
            </Well>
          )}
          <div className="form-controls">
            <Button
              bsStyle="default"
              onClick={onClose}
            >
              Takaisin
            </Button>
            <Button
              bsStyle="primary"
              disabled={isMakingReservations}
              onClick={handleSubmit(onConfirm)}
              type="submit"
            >
              {isMakingReservations ? 'Tallennetaan...' : 'Tallenna'}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  staffEventSelected: PropTypes.bool,
  termsAndConditions: PropTypes.string.isRequired,
};

export default reduxForm({
  form: 'preliminaryReservation',
  validate,
})(UnconnectedReservationForm);
