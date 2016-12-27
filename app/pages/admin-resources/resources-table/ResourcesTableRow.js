import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CommentButton from 'shared/comment-button';
import ReservationAccessCode from 'shared/reservation-access-code';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';
import { getOpeningHours, getResourcePageUrl } from 'utils/resourceUtils';
import { prettifyHours } from 'utils/timeUtils';

class ResourcesTableRow extends Component {
  getAvailableTime(untilDate) {
    const availableHours = moment(untilDate).diff(moment(), 'hours', true);
    return prettifyHours(availableHours, true);
  }

  getReserverName(reservation) {
    return (
      reservation.reserverName ||
      (reservation.user &&
        ((reservation.user.displayName !== '' && reservation.user.displayName) ||
        reservation.user.email)
      )
    );
  }

  renderAvailable() {
    const {
      currentReservation,
      nextReservation,
      resource,
      t,
    } = this.props;
    const { closes, opens } = getOpeningHours(resource);
    const now = moment();
    const closedToday = (closes && opens) === null;

    if (closedToday || ((now < moment(opens)) || (moment(closes) < now))) {
      return (
        <td className="resource-table-row availability reserved">
          {t('ResourcesTableRow.closed')}
        </td>
      );
    }
    if (currentReservation) {
      return (
        <td className="resource-table-row availability reserved">
          {t('ResourcesTableRow.reserved')}
        </td>
      );
    }
    if (nextReservation) {
      const availableTime = this.getAvailableTime(nextReservation.begin);
      return (
        <td className="resource-table-row availability">
          {t('ResourcesTableRow.availableTime', { availableTime })}
        </td>
      );
    }
    const availableTime = this.getAvailableTime(closes);
    return (
      <td className="resource-table-row availability">
        {t('ResourcesTableRow.availableTime', { availableTime })}
      </td>
    );
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
            {resource.name}
          </Link>
        </td>
        {this.renderAvailable()}
        { reservation ? [
          <td className="resource-table-row reservation-range" key={`${reservation.id}-range`}>
            <TimeRange
              begin={reservation.begin}
              beginFormat="LT"
              end={reservation.end}
              endFormat="LT"
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
  t: PropTypes.func.isRequired,
};

export default injectT(ResourcesTableRow);
