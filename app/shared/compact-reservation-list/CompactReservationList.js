import React, { Component, PropTypes } from 'react';

import TimeRange from 'shared/time-range';

class CompactReservationList extends Component {
  constructor(props) {
    super(props);
    this.renderReservation = this.renderReservation.bind(this);
  }

  renderReservation(reservation) {
    let resourceName = null;
    if (this.props.resources) {
      const resource = this.props.resources[reservation.resource] || {};
      resourceName = resource.name;
    }
    return (
      <li key={reservation.begin}>
        {resourceName ? `${resourceName}: ` : ''}
        <TimeRange begin={reservation.begin} end={reservation.end} />
        {this.props.subtitle &&
          <div className="compact-reservation-list-subtitle">{reservation[this.props.subtitle]}</div>
        }
      </li>
    );
  }

  render() {
    return (
      <ul className="compact-reservation-list">
        {this.props.reservations.map(this.renderReservation)}
      </ul>
    );
  }
}

CompactReservationList.propTypes = {
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object,
  subtitle: PropTypes.string,
};

export default CompactReservationList;
