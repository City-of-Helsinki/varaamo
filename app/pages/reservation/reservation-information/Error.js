import React from 'react';
import PropTypes from 'prop-types';

function Error({ error }) {
  return <span className="app-ReservationPage__error">{error}</span>;
}

Error.propTypes = {
  error: PropTypes.string.isRequired,
};

export default Error;
