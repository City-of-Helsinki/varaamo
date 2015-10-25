import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import { getName } from 'utils/DataUtils';

class ReservationsTableRow extends Component {
  render() {
    const { reservation, resource, unit } = this.props;

    return (
      <tr>
        <td>
          <Link to={`/resources/${resource.id}`}>
            {getName(resource)}
          </Link>
        </td>
        <td>{getName(unit)}</td>
        <td>
          <TimeRange begin={reservation.begin} end={reservation.end} />
        </td>
      </tr>
    );
  }
}

ReservationsTableRow.propTypes = {
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ReservationsTableRow;
