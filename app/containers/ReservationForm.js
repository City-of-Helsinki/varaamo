import includes from 'lodash/collection/includes';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import { reduxForm } from 'redux-form';

import isEmail from 'validator/lib/isEmail';

const validators = {
  email: ({ email }) => {
    if (email && !isEmail(email)) {
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
    return (
      <Input
        {...field}
        {...extraProps}
        bsStyle={hasError ? 'error' : null}
        help={hasError ? field.error : null}
        label={label}
        labelClassName="col-xs-3"
        type={type}
        wrapperClassName="col-xs-9"
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
        <form className="preliminary-reservatin-form form-horizontal">
          {this.renderField('text', 'Nimi*', fields.name)}
          {this.renderField('email', 'Sähköposti*', fields.email)}
          {this.renderField('text', 'Puhelin*', fields.phone)}
          {this.renderField('textarea', 'Tilaisuuden kuvaus*', fields.description, { rows: 5 })}
          {this.renderField('text', 'Osoite*', fields.address)}
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
              Peruuta
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
