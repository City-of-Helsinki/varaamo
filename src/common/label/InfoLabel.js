import React from 'react';
import PropTypes from 'prop-types';
import Label from 'react-bootstrap/lib/Label';

const InfoLabel = ({ labelStyle, labelText }) => {
  return (
    <div className="app-InfoLabel">
      <Label bsStyle={labelStyle}>{labelText}</Label>
    </div>
  );
};

InfoLabel.propTypes = {
  labelStyle: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
};

export default InfoLabel;
