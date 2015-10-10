import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TimeSlots from 'components/reservation/TimeSlots';
import { reservationFormSelectors } from 'selectors/reservationFormSelectors';

export class UnconnectedReservationForm extends Component {
  render() {
    const { isFetchingResource, timeSlots } = this.props;

    return (
      <div>
        <TimeSlots
          isFetching={isFetchingResource}
          slots={timeSlots}
        />
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  isFetchingResource: PropTypes.bool,
  timeSlots: PropTypes.array.isRequired,
};

export default connect(reservationFormSelectors)(UnconnectedReservationForm);
