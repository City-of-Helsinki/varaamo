import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import ReservationAccessCode from '../../../../reservation-access-code';
import utils from '../utils';

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
    <Popover className="reservation-info-popover" id={`popover-${reservation.id}`} title={reservation.eventSubject}>
      <div>
        <Glyphicon glyph="time" />
        {`${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`}
      </div>
      {reserverName && <div>{reserverName}</div>}
      {reservation.numberOfParticipants && (
      <div>
        <Glyphicon glyph="user" />
        {' '}
        {reservation.numberOfParticipants}
      </div>
      )}
      {reservation.accessCode && <div><ReservationAccessCode reservation={reservation} /></div>}
      {reservation.comments && <hr />}
      {reservation.comments && (
      <div>
        <Glyphicon glyph="comment" />
        {' '}
        {reservation.comments}
      </div>
      )}
    </Popover>
  );
  return (
    <button
      className={classNames('reservation-link', { 'with-comments': reservation.comments })}
      onClick={() => onClick && reservation.userPermissions.canModify && onClick(reservation)}
      type="button"
    >
      <OverlayTrigger
        overlay={popover}
        placement="top"
        trigger={['hover', 'focus']}
      >
        <span
          className={classNames('reservation',
            { requested: reservation.state === 'requested' },
            { disabled: reservation.state === 'confirmed' && !reservation.isOwn && !reservation.userPermissions.canModify },
            { reserved: reservation.state === 'confirmed' && !reservation.isOwn && reservation.userPermissions.canModify })}
          style={{ width }}
        >
          <span className="names">
            <span className="event-subject">{reservation.eventSubject}</span>
            <span className="reserver-name">{reserverName}</span>
          </span>
        </span>
      </OverlayTrigger>
    </button>
  );
}

export default Reservation;
