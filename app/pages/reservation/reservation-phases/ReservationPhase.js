import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { injectT } from 'i18n';

ReservationPhase.propTypes = {
  cols: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

function ReservationPhase({ cols, index, isActive, isCompleted, title }) {
  const active = isActive ? ' app-ReservationPage__phase-active' : '';
  const completed = isCompleted ? ' app-ReservationPage__phase-completed' : '';
  return (
    <div className={`app-ReservationPage__phase col-sm-${cols}${active}${completed}`}>
      <div className="app-ReservationPage__phase-index">{index}</div>
      <div className="app-ReservationPage__phase-title">
        {title}
        { isCompleted &&
          <Glyphicon glyph="ok" />
        }
      </div>
    </div>
  );
}

export default injectT(ReservationPhase);
