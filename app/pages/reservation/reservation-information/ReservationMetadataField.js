import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Textarea from './Textarea';
import Terms from './Terms';

function ReservationMetadataField({ type, ...rest }) {
  if (type === 'textarea') {
    return <Textarea {...rest} />;
  }
  if (type === 'terms') {
    return <Terms {...rest} />;
  }
  return <Input type={type} {...rest} />;
}

ReservationMetadataField.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ReservationMetadataField;
