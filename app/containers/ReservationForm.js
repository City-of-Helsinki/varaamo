import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { makeReservation } from 'actions/reservationActions';
import { fetchResource } from 'actions/resourceActions';
import { changeReservationDate, toggleTimeSlot } from 'actions/uiActions';
import DateHeader from 'components/common/DateHeader';
import TimeSlots from 'components/reservation/TimeSlots';
import { reservationFormSelectors } from 'selectors/reservationFormSelectors';
import { getDateStartAndEndTimes } from 'utils/DataUtils';
import { getDateString } from 'utils/TimeUtils';

export class UnconnectedReservationForm extends Component {
  constructor(props) {
    super(props);
    this.handleReservation = this.handleReservation.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(newDate) {
    const { actions, id } = this.props;
    const fetchParams = getDateStartAndEndTimes(newDate);

    actions.changeReservationDate(newDate);
    actions.fetchResource(id, fetchParams);
  }

  handleReservation() {
    const { actions, id, selected } = this.props;
    const reservations = selected.map(current => {
      return {
        begin: current.split('/')[0],
        end: current.split('/')[1],
        resource: id,
      };
    });

    reservations.forEach(reservation => {
      actions.makeReservation(reservation);
    });
  }

  render() {
    const {
      actions,
      date,
      isFetchingResource,
      selected,
      timeSlots,
    } = this.props;

    return (
      <div>
        <DatePicker
          date={getDateString(date)}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={this.onDateChange}
          todayText="Tänään"
        />
        <DateHeader
          date={date}
          onChange={this.onDateChange}
        />
        <TimeSlots
          isFetching={isFetchingResource}
          onChange={actions.toggleTimeSlot}
          selected={selected}
          slots={timeSlots}
        />
        <Button
          block
          bsStyle="primary"
          disabled={!selected.length}
          onClick={this.handleReservation}
        >
          Varaa
        </Button>
      </div>
    );
  }
}

UnconnectedReservationForm.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  selected: PropTypes.array.isRequired,
  timeSlots: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeReservationDate,
    fetchResource,
    makeReservation,
    toggleTimeSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationFormSelectors, mapDispatchToProps)(UnconnectedReservationForm);
