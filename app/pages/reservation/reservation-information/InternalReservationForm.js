import PropTypes from 'prop-types';
import React, { Component } from 'react';
import injectT from '../../../i18n/injectT';
import { Field, reduxForm } from 'redux-form';
import FormTypes from '../../../constants/FormTypes';

export function validate() {
  const errors = {};
  return errors;
}

class UnconnectedInternalReservationForm extends Component {
  render() {
    const {
      foo
    } = this.props;
    return (
      <Field
        component="input"
        name="inputName"
        type="text"
      />
    );
  }
}

UnconnectedInternalReservationForm.propTypes = {
  foo: PropTypes.string.isRequired,
};
UnconnectedInternalReservationForm = injectT(UnconnectedInternalReservationForm);  // eslint-disable-line

export { UnconnectedInternalReservationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION
})(UnconnectedInternalReservationForm));
