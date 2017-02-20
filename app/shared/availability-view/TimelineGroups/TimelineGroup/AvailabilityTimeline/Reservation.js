import moment from 'moment';
import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import ReservationAccessCode from 'shared/reservation-access-code';
import utils from '../utils';
import Link from './Link';

function getReserverName(reserverName, user) {
  return reserverName || (user && (user.displayName || user.email));
}

Reservation.propTypes = {
  accessCode: PropTypes.string,
  begin: PropTypes.string.isRequired,
  comments: PropTypes.string,
  end: PropTypes.string.isRequired,
  eventSubject: PropTypes.string,
  id: PropTypes.number.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func,
  reserverName: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
};

function Reservation(props) {
  const startTime = moment(props.begin);
  const endTime = moment(props.end);
  const width = utils.getTimeSlotWidth({ startTime, endTime });
  const reserverName = getReserverName(props.reserverName, props.user);
  const popover = (
    <Popover className="reservation-popover" id={`popover-${props.id}`} title={props.eventSubject}>
      <div>
        <Glyphicon glyph="time" />
        {' '}
        {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
      </div>
      {reserverName && <div>{reserverName}</div>}
      {props.numberOfParticipants && <div><Glyphicon glyph="user" /> {props.numberOfParticipants}</div>}
      {props.accessCode && <div><ReservationAccessCode reservation={props} /></div>}
      {props.comments && <hr />}
      {props.comments && <div><Glyphicon glyph="comment" /> {props.comments}</div>}
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
            <div className="reserver-name">{reserverName}</div>
          </div>
        </div>
      </OverlayTrigger>
    </Link>
  );
}

export default Reservation;
