import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

import { injectT } from 'i18n';

function SearchControlOverlay({ children, onHide, title }) {
  return (
    <div className="app-SearchControlOverlay">
      <div className="app-SearchControlOverlay__overlay">
        <div className="app-SearchControlOverlay__header">
          <h2>{title}</h2>
          <Button
            bsStyle="link"
            className="app-SearchControlOverlay__hide"
            onClick={onHide}
          >
            &times;
          </Button>
        </div>
        <div className="app-SearchControlOverlay__content">
          {children}
        </div>
      </div>
    </div>
  );
}

SearchControlOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default injectT(SearchControlOverlay);
