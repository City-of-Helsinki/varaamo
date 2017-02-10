import classNames from 'classnames';
import moment from 'moment';
import React, { PropTypes } from 'react';

import AvailabilityTimelineContainer from './AvailabilityTimeline';
import utils from './utils';

function getHourRanges(date) {
  const ranges = [];
  const current = moment(date);
  const end = moment(date).add(1, 'day');
  while (current.isBefore(end)) {
    ranges.push({ startTime: current.clone(), endTime: current.clone().add(1, 'hour') });
    current.add(1, 'hour');
  }
  return ranges;
}

export default class TimelineGroup extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    date: PropTypes.string.isRequired,
    onReservationSlotClick: PropTypes.func,
    resources: PropTypes.arrayOf(PropTypes.string).isRequired,
    selection: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.setElement = this.setElement.bind(this);
  }

  setElement(element) {
    this.element = element;
  }

  scrollTo(pixels) {
    if (this.element) this.element.scrollLeft = pixels;
  }

  render() {
    const { onReservationSlotClick, selection } = this.props;
    return (
      <div
        className={classNames('timeline-group', this.props.className)}
        ref={this.setElement}
      >
        <div className="hours">
          {getHourRanges(this.props.date).map(range =>
            <div
              className="hour"
              key={range.startTime.format('HH')}
              style={{ width: utils.getTimeSlotWidth(range) }}
            >
              {range.startTime.format('HH:mm')}
            </div>
          )}
        </div>
        {this.props.resources.map(resource =>
          <AvailabilityTimelineContainer
            date={this.props.date}
            id={resource}
            key={resource}
            onReservationSlotClick={onReservationSlotClick}
            selection={selection}
          />
        )}
      </div>
    );
  }
}
