import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import { reduxForm } from 'redux-form';

import isEmail from 'validator/lib/isEmail';

export function validate(values) {
  const errors = {};

  if (!values.name) {
    errors.name = 'Pakollinen tieto';
  }

  if (!values.email) {
    errors.email = 'Pakollinen tieto';
  } else if (!isEmail(values.email)) {
    errors.email = 'Syötä kunnollinen sähköpostiosoite';
  }

  if (!values.phone) {
    errors.phone = 'Pakollinen tieto';
  }

  if (!values.description) {
    errors.description = 'Pakollinen tieto';
  }

  if (!values.address) {
    errors.address = 'Pakollinen tieto';
  }
  return errors;
}

export class UnconnectedReservationForm extends Component {
  onSubmit(data) {
    console.log('the form was submitted with', data); // eslint-disable-line no-console
  }

  renderField(type, label, field, extraProps) {
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
    } = this.props;
    return (
      <div>
        <form className="preliminary-reservatin-form form-horizontal">
          <p>
            Täytä vielä seuraavat tiedot alustavaa varausta varten.
            Tähdellä (*) merkityt tiedot ovat pakollisia.
          </p>
          {this.renderField('text', 'Nimi*', fields.name)}
          {this.renderField('email', 'Sähköposti*', fields.email)}
          {this.renderField('text', 'Puhelin*', fields.phone)}
          {this.renderField('textarea', 'Tilaisuuden kuvaus*', fields.description, { rows: 5 })}
          {this.renderField('text', 'Osoite*', fields.address)}
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
              onClick={handleSubmit(this.onSubmit)}
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
};

export default reduxForm({
  fields: ['name', 'email', 'phone', 'description', 'address'],
  form: 'preliminaryReservation',
  validate,
})(UnconnectedReservationForm);
