import includes from 'lodash/collection/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Well from 'react-bootstrap/lib/Well';
import { reduxForm } from 'redux-form';

import isEmail from 'validator/lib/isEmail';

const validators = {
  reserverEmailAddress: ({ reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return 'Syötä kunnollinen sähköpostiosoite';
    }
  },
};

const maxLengths = {
  billingAddressCity: 100,
  billingAddressStreet: 100,
  billingAddressZip: 30,
  businessId: 9,
  company: 100,
  eventDescription: 100,
  numberOfParticipants: 100,
  reserverAddressCity: 100,
  reserverAddressStreet: 100,
  reserverAddressZip: 30,
  reserverEmailAddress: 100,
  reserverName: 100,
  reserverPhoneNumber: 30,
};

export function validate(values, { fields, requiredFields }) {
  const errors = {};
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
    if (includes(requiredFields, field)) {
      if (!values[field]) {
        errors[field] = 'Pakollinen tieto';
      }
    }
  });
  return errors;
}

export class UnconnectedReservationForm extends Component {
  renderField(type, label, field, extraProps) {
    if (!field) {
      return null;
    }
    const hasError = field.error && field.touched;
    const isRequired = includes(this.props.requiredFields, field.name);

    return (
      <Input
        {...field}
        {...extraProps}
        bsStyle={hasError ? 'error' : null}
        help={hasError ? field.error : null}
        label={`${label}${isRequired ? '*' : ''}`}
        labelClassName="col-sm-3"
        type={type}
        wrapperClassName="col-sm-9"
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
    } = this.props;
    return (
      <div>
        <form className="reservation-form form-horizontal">
          {this.renderField('text', 'Nimi', fields.reserverName)}
          {this.renderField('email', 'Sähköposti', fields.reserverEmailAddress)}
          {this.renderField('text', 'Puhelin', fields.reserverPhoneNumber)}
          {this.renderField('textarea', 'Tilaisuuden kuvaus', fields.eventDescription, { rows: 5 })}
          { fields.reserverAddressStreet && (
            <Well>
              <p>Osoite</p>
              {this.renderField('text', 'Katuosoite', fields.reserverAddressStreet)}
              {this.renderField('text', 'Postinumero', fields.reserverAddressZip)}
              {this.renderField('text', 'Kaupunki', fields.reserverAddressCity)}
            </Well>
          )}
          {this.renderField('text', 'Yhdistyksen nimi', fields.company)}
          {this.renderField('text', 'Y-tunnus', fields.businessId)}
          { fields.reserverAddressStreet && (
            <Well>
              <p>Laskutusosoite</p>
              {this.renderField('text', 'Katuosoite', fields.billingAddressStreet)}
              {this.renderField('text', 'Postinumero', fields.billingAddressZip)}
              {this.renderField('text', 'Kaupunki', fields.billingAddressCity)}
            </Well>
          )}
          {this.renderField('number', 'Osallistujamäärä', fields.numberOfParticipants, { min: '0' })}
          {this.renderField(
            'textarea',
            'Kommentit',
            fields.comments,
            {
              placeholder: 'Varauksen mahdolliset lisätiedot',
              rows: 5,
            }
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
        </form>
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
};

export default reduxForm({
  form: 'preliminaryReservation',
  validate,
})(UnconnectedReservationForm);
