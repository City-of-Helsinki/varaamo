import React, { Component, PropTypes } from 'react';

import TimeRange from 'shared/time-range';
import { getName } from 'utils/translationUtils';

class CompactReservationList extends Component {
  constructor(props) {
    super(props);
    this.renderReservation = this.renderReservation.bind(this);
  }

  renderReservation(reservation) {
    if (!this.props.resources) {
      return (
        <li key={reservation.begin}>
          <TimeRange begin={reservation.begin} end={reservation.end} />
        </li>
      );
    }
    const resource = this.props.resources[reservation.resource] || {};
    return (
      <li key={reservation.begin}>
        {getName(resource)}
        {': '}
        <TimeRange begin={reservation.begin} end={reservation.end} />
      </li>
    );
  }

  render() {
    return (
      <ul>
        {this.props.reservations.map(this.renderReservation)}
      </ul>
    );
  }
}

CompactReservationList.propTypes = {
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object,
};

export default CompactReservationList;
