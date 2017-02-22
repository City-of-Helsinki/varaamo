import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import Sidebar from './Sidebar';

export default class AvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDateChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { selection: null };
    this.handleReservationSlotClick = this.handleReservationSlotClick.bind(this);
  }

  handleReservationSlotClick(slot) {
    if (this.state.selection) {
      this.endSelection(slot);
    } else {
      this.startSelection(slot);
    }
  }

  endSelection(slot) {
    const isValid = (
      this.state.selection.resourceId === slot.resourceId &&
      this.state.selection.begin <= slot.begin
    );
    if (!isValid) {
      return;
    }
    const selection = { end: slot.end, ...this.state.selection };
    if (this.props.onSelect) this.props.onSelect(selection);
    this.setState({ selection: null });
  }

  startSelection(slot) {
    this.setState({ selection: slot });
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
            selection={this.state.selection}
          />
        </div>
      </div>
    );
  }
}
