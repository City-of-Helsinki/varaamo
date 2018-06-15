import classnames from 'classnames';
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
  state: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
};

function Reservation({ onClick, ...reservation }) {
  const startTime = moment(reservation.begin);
  const endTime = moment(reservation.end);
  const width = utils.getTimeSlotWidth({ startTime, endTime });
  const reserverName = getReserverName(reservation.reserverName, reservation.user);
  const popover = (
    <Popover className="reservation-popover" id={`popover-${reservation.id}`} title={reservation.eventSubject}>
      <div>
        <Glyphicon glyph="time" />
        {' '}
        {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
      </div>
      {reserverName && <div>{reserverName}</div>}
      {reservation.numberOfParticipants && <div><Glyphicon glyph="user" /> {reservation.numberOfParticipants}</div>}
      {reservation.accessCode && <div><ReservationAccessCode reservation={reservation} /></div>}
      {reservation.comments && <hr />}
      {reservation.comments && <div><Glyphicon glyph="comment" /> {reservation.comments}</div>}
    </Popover>
  );
  return (
    <Link
      className={classnames('reservation-link', { 'with-comments': reservation.comments })}
      onClick={() => onClick && reservation.userPermissions.canModify && onClick(reservation)}
    >
      <OverlayTrigger
        overlay={popover}
        placement="top"
        trigger={['hover', 'focus']}
      >
        <div
          className={classnames('reservation',
          { requested: reservation.state === 'requested' },
          { disabled: reservation.state === 'confirmed' && !reservation.isOwn && !reservation.userPermissions.canModify },
          { reserved: reservation.state === 'confirmed' && !reservation.isOwn && reservation.userPermissions.canModify })}
          style={{ width }}
        >
          <div className="names">
            <div className="event-subject">{reservation.eventSubject}</div>
            <div className="reserver-name">{reserverName}</div>
          </div>
        </div>
      </OverlayTrigger>
    </Link>
  );
}

export default Reservation;
