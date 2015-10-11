import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeReservationDate } from 'actions/uiActions';
import DatePicker from 'components/common/DatePicker';
import TimeSlots from 'components/reservation/TimeSlots';
import { reservationFormSelectors } from 'selectors/reservationFormSelectors';

export class UnconnectedReservationForm extends Component {
  render() {
    const { actions, date, isFetchingResource, timeSlots } = this.props;

    return (
      <div>
        <DatePicker
          date={date}
          onChange={actions.changeReservationDate}
        />
        <TimeSlots
          isFetching={isFetchingResource}
          slots={timeSlots}
        />
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool,
  timeSlots: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeReservationDate,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationFormSelectors, mapDispatchToProps)(UnconnectedReservationForm);
