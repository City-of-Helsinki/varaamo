import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import Sidebar from './Sidebar';

export default class AvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDateChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { selection: null };
    this.handleReservationSlotClick = this.handleReservationSlotClick.bind(this);
  }

  handleReservationSlotClick(slot) {
    const selection = { begin: slot.begin, resourceId: slot.resourceId };
    this.setState({ selection });
  }

  render() {
    return (
      <div className="availability-view">
        <div className="left">
          <div className="top-left" />
          <Sidebar date={this.props.date} groups={this.props.groups} />
        </div>
        <div className="right">
          <DateSelector onChange={this.props.onDateChange} value={this.props.date} />
          <TimelineGroups
            date={this.props.date}
            groups={this.props.groups}
            onReservationSlotClick={this.handleReservationSlotClick}
          />
        </div>
      </div>
    );
  }
}
