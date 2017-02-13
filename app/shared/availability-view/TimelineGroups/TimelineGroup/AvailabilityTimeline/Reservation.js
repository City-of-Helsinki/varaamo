import moment from 'moment';
import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import utils from '../utils';
import Link from './Link';

Reservation.propTypes = {
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  eventSubject: PropTypes.string,
  id: PropTypes.number.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func,
  reserverName: PropTypes.string,
};

function Reservation(props) {
  const startTime = moment(props.begin);
  const endTime = moment(props.end);
  const width = utils.getTimeSlotWidth({ startTime, endTime });
  const popover = (
    <Popover id={`popover-${props.id}`} title={props.eventSubject}>
      <div>
        <Glyphicon glyph="time" />
        {' '}
        {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
      </div>
      {props.reserverName && <div>{props.reserverName}</div>}
      {props.numberOfParticipants && <div><Glyphicon glyph="user" /> {props.numberOfParticipants}</div>}
    </Popover>
  );
  return (
    <Link className="reservation-link" onClick={() => props.onClick && props.onClick(props.id)}>
      <OverlayTrigger
        overlay={popover}
        placement="top"
        trigger={['hover', 'focus']}
      >
        <div className="reservation" style={{ width }}>
          <div className="names">
            <div className="event-subject">{props.eventSubject}</div>
            <div className="reserver-name">{props.reserverName}</div>
          </div>
        </div>
      </OverlayTrigger>
    </Link>
  );
}

export default Reservation;
