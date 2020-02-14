import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import PropTypes from 'prop-types';

import injectT from '../../../../app/i18n/injectT';

const CalendarLegend = (props) => {
  const { t } = props;
  return (
    <div className="app-CalendarLegend">
      <Col md={3}>
        <div className="color-box color-box__closed" />
        <p>{t('CalendarLegend.closed')}</p>
      </Col>

      <Col md={3}>
        <div className="color-box color-box__selection" />
        <p>{t('CalendarLegend.selection')}</p>
      </Col>

      <Col md={3}>
        <div className="color-box color-box__taken" />
        <p>{t('CalendarLegend.taken')}</p>
      </Col>

      <Col md={3}>
        <div className="color-box color-box__available">
          <span className="dash" />
        </div>
        <p>{t('CalendarLegend.available')}</p>
      </Col>
    </div>
  );
};

CalendarLegend.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(CalendarLegend);
