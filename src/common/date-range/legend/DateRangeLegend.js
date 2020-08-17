import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../../app/i18n/injectT';

const DateRangeLegend = (props) => {
  const { t } = props;
  return (
    <div className="app-DateRangeLegend">
      <div className="app-DateRangeLegend__legend-item">
        <div className="app-DateRangeLegend__color-box app-DateRangeLegend__color-box--available">01</div>
        <p>{t('DateRangeLegend.available')}</p>
      </div>

      <div className="app-DateRangeLegend__legend-item">
        <div className="app-DateRangeLegend__color-box app-DateRangeLegend__color-box--start">01</div>
        <p>{t('DateRangeLegend.availableStartingDay')}</p>
      </div>

      <div className="app-DateRangeLegend__legend-item">
        <div className="app-DateRangeLegend__color-box app-DateRangeLegend__color-box--reserved">01</div>
        <p>{t('DateRangeLegend.reserved')}</p>
      </div>

      <div className="app-DateRangeLegend__legend-item">
        <div className="app-DateRangeLegend__color-box app-DateRangeLegend__color-box--selection">01</div>
        <p>{t('DateRangeLegend.selection')}</p>
      </div>

      <div className="app-DateRangeLegend__legend-item">
        <div className="app-DateRangeLegend__color-box app-DateRangeLegend__color-box--unavailable">01</div>
        <p>{t('DateRangeLegend.unavailable')}</p>
      </div>
    </div>
  );
};

DateRangeLegend.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(DateRangeLegend);
