import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import moment from 'moment';

import injectT from '../../i18n/injectT';

class ReservationPopover extends PureComponent {
  render() {
    const {
      begin, children, end, onCancel, t
    } = this.props;
    const reservationLength = end ? moment.duration(moment(end).diff(moment(begin))) : null;

    const popover = (
      <Popover
        className="reservation-popover"
        id="popover-selection-information"
        title={t('ReservationPopover.selectionInfoHeader')}
      >
        <span>
          {moment(begin).format('HH:mm')}
–
          {end && moment(end).format('HH:mm')}
        </span>

        {reservationLength && (
          <span className="reservation-popover__length">
            {reservationLength.hours()
              ? `(${reservationLength.hours()}h ${reservationLength.minutes()}min)`
              : `(${reservationLength.minutes()}min)`}
          </span>
        )}

        <Glyphicon className="reservation-popover__cancel" glyph="trash" onClick={onCancel} />
      </Popover>
    );
    return (
      <OverlayTrigger defaultOverlayShown overlay={popover} placement="top" trigger={[]}>
        {children}
      </OverlayTrigger>
    );
  }
}

ReservationPopover.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  onCancel: PropTypes.func.isRequired,
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationPopover);
