import includes from 'lodash/collection/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Well from 'react-bootstrap/lib/Well';
import { reduxForm } from 'redux-form';

import isEmail from 'validator/lib/isEmail';

const validators = {
  reserver_email: ({ reserver_email }) => {
    if (reserver_email && !isEmail(reserver_email)) {
      return 'Syötä kunnollinen sähköpostiosoite';
    }
  },
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
          {this.renderField('text', 'Nimi', fields.reserver_name)}
          {this.renderField('email', 'Sähköposti', fields.reserver_email)}
          {this.renderField('text', 'Puhelin', fields.reserver_phone_number)}
          {this.renderField('textarea', 'Tilaisuuden kuvaus', fields.event_description, { rows: 5 })}
          { fields.reserver_address_street && (
            <Well>
              <p>Osoite</p>
              {this.renderField('text', 'Katuosoite', fields.reserver_address_street)}
              {this.renderField('text', 'Postinumero', fields.reserver_address_zip)}
              {this.renderField('text', 'Kaupunki', fields.reserver_address_city)}
            </Well>
          )}
          {this.renderField('text', 'Yhdistyksen nimi', fields.company)}
          {this.renderField('text', 'Y-tunnus', fields.business_id)}
          { fields.reserver_address_street && (
            <Well>
              <p>Laskutusosoite</p>
              {this.renderField('text', 'Katuosoite', fields.billing_address_street)}
              {this.renderField('text', 'Postinumero', fields.billing_address_zip)}
              {this.renderField('text', 'Kaupunki', fields.billing_address_city)}
            </Well>
          )}
          {this.renderField('number', 'Osallistujamäärä', fields.number_of_participants, { min: '0' })}
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
