import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import CommentButton from 'shared/comment-button';
import ReservationAccessCode from 'shared/reservation-access-code';
import TimeRange from 'shared/time-range';
import { getOpeningHours, getResourcePageUrl } from 'utils/resourceUtils';
import { prettifyHours } from 'utils/timeUtils';

class ResourcesTableRow extends Component {
  getReserverName(reservation) {
    return (
      reservation.reserverName ||
      (reservation.user &&
        ((reservation.user.displayName !== '' && reservation.user.displayName) ||
        reservation.user.email)
      )
    );
  }

  getAvailableTime(untilDate) {
    const availableHours = moment(untilDate).diff(moment(), 'hours', true);
    const availableTime = prettifyHours(availableHours, true);
    return (
      <td className="resource-table-row availability">
        {`${availableTime} heti`}
      </td>
    );
  }

  renderAvailable() {
    const {
      currentReservation,
      nextReservation,
      resource,
    } = this.props;
    const { closes, opens } = getOpeningHours(resource);
    const now = moment();
    const closedToday = (closes && opens) === null;

    if (closedToday || ((now < moment(opens)) || (moment(closes) < now))) {
      return <td className="resource-table-row availability reserved">Suljettu</td>;
    }
    if (currentReservation) {
      return <td className="resource-table-row availability reserved">Varattu</td>;
    }
    if (nextReservation) {
      return this.getAvailableTime(nextReservation.begin);
    }
    return this.getAvailableTime(closes);
  }

  render() {
    const {
      currentReservation,
      nextReservation,
      resource,
    } = this.props;
    const reservation = currentReservation || nextReservation;
    return (
      <tr>
        <td className="resource-table-row name">
          <Link to={getResourcePageUrl(resource)}>
            {resource.name.fi}
          </Link>
        </td>
        {this.renderAvailable()}
        { reservation ? [
          <td className="resource-table-row reservation-range" key={`${reservation.id}-range`}>
            <TimeRange
              begin={reservation.begin}
              dateFormat=" "
              dateTimeSeparator=""
              end={reservation.end}
            />
          </td>,
          <td className="resource-table-row reserver" key={`${reservation.id}-reserver`}>
            {this.getReserverName(reservation)}
            <ReservationAccessCode reservation={reservation} />
          </td>,
          <td className="resource-table-row comments" key={`${reservation.id}-comments`}>
            {reservation.comments}
            <CommentButton reservation={reservation} />
          </td>,
        ] : [
          <td className="resource-table-row reservation-range" key="no-res-range" />,
          <td className="resource-table-row reserver" key="no-res-reserver" />,
          <td className="resource-table-row comments" key="no-res-comments" />,
        ]}
      </tr>
    );
  }
}

const reservationPropType = PropTypes.shape({
  begin: PropTypes.string.isRequired,
  comments: PropTypes.string,
  end: PropTypes.string.isRequired,
  reserverName: PropTypes.string,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
});

ResourcesTableRow.propTypes = {
  currentReservation: reservationPropType,
  nextReservation: reservationPropType,
  resource: PropTypes.shape({
    openingHours: PropTypes.array.isRequired,
  }).isRequired,
};

export default ResourcesTableRow;
