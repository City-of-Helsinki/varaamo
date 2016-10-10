import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

function Checkbox({ controlProps = {}, help, id, label, validationState }) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <Col sm={9} smOffset={3}>
        <RBCheckbox {...controlProps}>
          {label}
        </RBCheckbox>
        {help && <HelpBlock>{help}</HelpBlock>}
      </Col>
    </FormGroup>
  );
}

Checkbox.propTypes = {
  controlProps: PropTypes.object,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

export default Checkbox;
