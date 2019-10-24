import PropTypes from 'prop-types';
import React, { Component } from 'react';
import injectT from '../../../i18n/injectT';
import { reduxForm } from 'redux-form';
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
      <input
        defaultValue=""
        name={foo}
        type="input"
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
  form: FormTypes.RESERVATION,
  validate,
})(UnconnectedInternalReservationForm));
