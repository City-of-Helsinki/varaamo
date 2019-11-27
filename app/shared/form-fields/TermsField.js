import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

function TermsField({
  input, label, meta
}) {
  const showError = meta.error && meta.touched;
  return (
    <FormGroup
      className="terms-checkbox-field"
      controlId={input.name}
      validationState={showError ? 'error' : undefined}
    >
      <Col sm={9}>
        <RBCheckbox {...input}>
          {label}
          *
          {showError && <HelpBlock>{meta.error}</HelpBlock>}
        </RBCheckbox>
      </Col>
    </FormGroup>
  );
}

TermsField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
};

export default TermsField;
