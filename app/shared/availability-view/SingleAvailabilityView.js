import dragscroll from 'dragscroll';
import PropTypes from 'prop-types';
import React from 'react';

import DateSelector from './DateSelector';
import TimelineGroup from './timeline-groups/timeline-group/TimelineGroup';

export default class SingleAvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onReservationSlotClick: PropTypes.func,
    resource: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.scrollToInitial = this.scrollToInitial.bind(this);
  }

  componentDidMount() {
    dragscroll.reset();
  }

  render() {
    return (
      <div className="availability-view availability-view-single">
        <DateSelector onChange={this.props.onDateChange} value={this.props.date} />
        <TimelineGroup
          className="dragscroll"
          date={this.props.date}
          onReservationSlotClick={this.props.onReservationSlotClick}
          ref={this.scrollToInitial}
          resources={[this.props.resource]}
          selection={this.props.selection}
        />
      </div>
    );
  }
}
