import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Well from 'react-bootstrap/lib/Well';
import { reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';

import WrappedText from 'components/common/WrappedText';
import constants from 'constants/AppConstants';
import ReduxFormField from 'screens/shared/form-fields/ReduxFormField';

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
  renderField(type, label, field, controlProps = {}, help = null) {
    if (!field) {
      return null;
    }
    const isRequired = includes(this.requiredFields, field.name);

    return (
      <ReduxFormField
        controlProps={controlProps}
        field={field}
        help={help}
        label={`${label}${isRequired ? '*' : ''}`}
        type={type}
      />
    );
  }

  render() {
    const {
      fields,
      isMakingReservations,
      handleSubmit,
      onClose,
      onConfirm,
      requiredFields,
      termsAndConditions,
    } = this.props;

    this.requiredFields = fields.staffEvent && fields.staffEvent.checked ?
      constants.REQUIRED_STAFF_EVENT_FIELDS :
      requiredFields;

    return (
      <div>
        <Form className="reservation-form" horizontal>
          { fields.staffEvent && (
            <Well>
              {this.renderField(
                'checkbox',
                'Viraston oma tapahtuma',
                fields.staffEvent,
                {},
                `Viraston oma tapahtuma hyväksytään automaattisesti ja ainoat pakolliset
                tiedot ovat varaajan nimi ja tilaisuuden kuvaus.`,
              )}
            </Well>
          )}
          {this.renderField('text', 'Varaaja / vuokraaja', fields.reserverName)}
          {this.renderField('text', 'Y-tunnus / henkilötunnus', fields.reserverId)}
          {this.renderField('text', 'Puhelin', fields.reserverPhoneNumber)}
          {this.renderField('email', 'Sähköposti', fields.reserverEmailAddress)}
          {this.renderField('textarea', 'Tilaisuuden kuvaus', fields.eventDescription, { rows: 5 })}
          {this.renderField(
            'number',
            'Osallistujamäärä',
            fields.numberOfParticipants,
            { min: '0' }
          )}
          { fields.reserverAddressStreet && (
            <Well>
              <p>Osoite</p>
              {this.renderField('text', 'Katuosoite', fields.reserverAddressStreet)}
              {this.renderField('text', 'Postinumero', fields.reserverAddressZip)}
              {this.renderField('text', 'Kaupunki', fields.reserverAddressCity)}
            </Well>
          )}
          { fields.billingAddressStreet && (
            <Well>
              <p>Laskutusosoite</p>
              {this.renderField('text', 'Katuosoite', fields.billingAddressStreet)}
              {this.renderField('text', 'Postinumero', fields.billingAddressZip)}
              {this.renderField('text', 'Kaupunki', fields.billingAddressCity)}
            </Well>
          )}
          {this.renderField(
            'textarea',
            'Kommentit',
            fields.comments,
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
                'checkbox',
                'Olen lukenut ja hyväksynyt tilan käyttösäännöt',
                fields.termsAndConditions
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
  fields: PropTypes.object.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
};

export default reduxForm({
  form: 'preliminaryReservation',
  validate,
})(UnconnectedReservationForm);
