import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { injectT } from 'i18n';

MapToggle.propTypes = {
  mapVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resultsCount: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

function MapToggle({ mapVisible, onClick, resultsCount, t }) {
  return (
    <button
      className="app-MapToggle btn"
      onClick={onClick}
    >
      <div className="app-MapToggle__icon">
        {mapVisible ? <Glyphicon glyph="list" /> : <Glyphicon glyph="map-marker" />}
      </div>
      <div className="app-MapToggle__text">
        <div className="app-MapToggle__results-count">
          {resultsCount ? t('MapToggle.resultsText', { count: resultsCount }) : t('MapToggle.noResultsText')}
        </div>
        {mapVisible ? t('MapToggle.showList') : t('MapToggle.showMap')}
      </div>
    </button>
  );
}

export default injectT(MapToggle);
