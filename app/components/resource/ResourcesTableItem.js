import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';

class ResourcesTableItem extends Component {

  renderAvailable() {
    const {
      currentReservation,
      nextReservation,
    } = this.props;
    if (currentReservation) {
      return <td className="resource-table-row available reserved">Varattu</td>;
    }
    if (nextReservation) {
      const availableTime = moment(nextReservation.begin).diff(moment(), 'hours', true).toFixed(1);
      return (
        <td className="resource-table-row available">{
          `${availableTime}h heti`
        }</td>
      );
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
            {reservation.reserverName}
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
  reserverName: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.string),
});

ResourcesTableItem.propTypes = {
  currentReservation: reservationPropType,
  nextReservation: reservationPropType,
  resource: PropTypes.object.isRequired,
};

export default ResourcesTableItem;
