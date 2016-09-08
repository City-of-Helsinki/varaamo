import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import { getOpeningHours } from 'utils/DataUtils';

class ResourcesTableItem extends Component {
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
    const availableTime = moment(untilDate).diff(moment(), 'hours', true).toFixed(1);
    return (
      <td className="resource-table-row available">{
        `${availableTime}h heti`
      }</td>
    );
  }

  renderAvailable() {
    const {
      currentReservation,
      nextReservation,
      resource,
    } = this.props;
    if (currentReservation) {
      return <td className="resource-table-row available reserved">Varattu</td>;
    }
    if (nextReservation) {
      return this.getAvailableTime(nextReservation.begin);
    }
    const closes = getOpeningHours(resource).closes;
    if (moment() < moment(closes)) {
      return this.getAvailableTime(closes);
    }
    return <td className="resource-table-row available" />;
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
          <Link to={`/resources/${resource.id}`}>
            {resource.name.fi}
          </Link>
        </td>
        {this.renderAvailable()}
        { reservation ? [
          <td className="resource-table-row reservation-range" key={`${reservation.id}-range`}>
            <TimeRange
              begin={reservation.begin}
              dateFormat=" "
              end={reservation.end}
            />
          </td>,
          <td className="resource-table-row reserver" key={`${reservation.id}-reserver`}>
            {this.getReserverName(reservation)}
          </td>,
          <td className="resource-table-row comments" key={`${reservation.id}-comments`}>
            {reservation.comments}
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
  end: PropTypes.string.isRequired,
  reserverName: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.string),
});

ResourcesTableItem.propTypes = {
  currentReservation: reservationPropType,
  nextReservation: reservationPropType,
  resource: PropTypes.shape({
    openingHours: PropTypes.array.isRequired,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default ResourcesTableItem;
