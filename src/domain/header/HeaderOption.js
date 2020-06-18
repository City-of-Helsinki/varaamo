import React from 'react';
import PropTypes from 'prop-types';

const HeaderOption = ({ label, children }) => {
  return (
    <div className="app-HeaderOption">
      <span className="app-HeaderOption__label">
        {label}
      </span>
      <div className="app-HeaderOption__option-list">
        {children}
      </div>
    </div>
  );
};

HeaderOption.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};


export default HeaderOption;
