import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';

import TimeRange from 'components/common/TimeRange';
import { getName } from 'utils/DataUtils';

class CompactReservationsList extends Component {
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
        {map(this.props.reservations, this.renderReservation)}
      </ul>
    );
  }
}

CompactReservationsList.propTypes = {
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object,
};

export default CompactReservationsList;
