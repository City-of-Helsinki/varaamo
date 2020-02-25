import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Textarea from './Textarea';
import Terms from './Terms';

function ReservationMetadataField({
  type, input, externalName, ...rest
}) {
  const name = externalName || input.name || undefined;
  const inputWithModifiedName = {
    ...input,
    name,
  };

  if (type === 'textarea') {
    return <Textarea {...rest} input={inputWithModifiedName} />;
  }

  if (type === 'terms') {
    return <Terms {...rest} input={inputWithModifiedName} />;
  }

  return <Input type={type} {...rest} input={inputWithModifiedName} />;
}

ReservationMetadataField.propTypes = {
  type: PropTypes.string.isRequired,
  // Input object passed from redux-form
  input: PropTypes.object.isRequired,
  // redux-form uses a name prop that represent the string path of the
  // value in the form's state. This means that the name prop contains
  // a value that speaks of the internal data model.

  // Some browsers, for instance Chrome according to its documentation,
  // don't guarantee auto filling for fields if the name attribute does
  // not equal some of the values it supports (ref1). It doesn't make
  // sense for me to refactor how we store form data within the form
  // state to conform to Chrome's expectations about field names.
  // Instead, we can replace the name attribute we use to be one that's
  // "outwards" facing. redux-form does not rely on the name value
  // within the change event to know what field it should update.

  // Generally speaking, it was difficult to find exact information on
  // how auto fill works, but ref1 instructs to give specific name and
  // autoComplete attributes. In practice it did seem like autofill
  // worked with just name or autoComplete matching the supported
  // values.

  // ref1: https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill
  externalName: PropTypes.string,
};

export default ReservationMetadataField;
