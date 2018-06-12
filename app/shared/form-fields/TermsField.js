import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

function TermsField({ input, label, labelLink, meta, name, onClick }) {
  const showError = meta.error && meta.touched;
  return (
    <FormGroup
      className="terms-checkbox-field"
      controlId={name}
      validationState={showError ? 'error' : undefined}
    >
      <Col sm={9}>
        <RBCheckbox {...input}>
          {label}{' '}
          <HelpBlock className="terms-checkbox-field-link" onClick={onClick}>
            {labelLink}
          </HelpBlock>
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
  labelLink: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TermsField;
