import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import Sidebar from './Sidebar';

AvailabilityView.propTypes = {
  date: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDateChange: PropTypes.func.isRequired,
};
export default function AvailabilityView(props) {
  return (
    <div className="availability-view">
      <div className="left">
        <div className="top-left" />
        <Sidebar date={props.date} groups={props.groups} />
      </div>
      <div className="right">
        <DateSelector onChange={props.onDateChange} value={props.date} />
        <TimelineGroups date={props.date} groups={props.groups} />
      </div>
    </div>
  );
}
