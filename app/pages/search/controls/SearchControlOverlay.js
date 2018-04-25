import React, { PropTypes } from 'react';

import { injectT } from 'i18n';

function SearchControlOverlay({ children }) {
  return (
    <div className="app-SearchControlOverlay">
      <div className="app-SearchControlOverlay__overlay">
        <div className="app-SearchControlOverlay__content">
          {children}
        </div>
      </div>
    </div>
  );
}

SearchControlOverlay.propTypes = {
  children: PropTypes.node.isRequired,
};

export default injectT(SearchControlOverlay);
