import { slotSize, slotWidth } from 'constants/SlotConstants';

import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Sticky from 'react-sticky-el';


import AvailabilityTimelineContainer from './AvailabilityTimeline';
import utils from './utils';

function getHourRanges(date) {
  const ranges = [];
  const current = moment(date);
  const end = moment(date).add(1, 'day');
  while (current.isBefore(end)) {
    ranges.push({
      startTime: current.clone(),
      midPoint: current.clone().add(30, 'minutes'),
      endTime: current.clone().add(1, 'hour'),
    });
    current.add(1, 'hour');
  }
  return ranges;
}

export default class TimelineGroup extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    date: PropTypes.string.isRequired,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseLeave: PropTypes.func,
    onSelectionCancel: PropTypes.func,
    resources: PropTypes.arrayOf(PropTypes.string).isRequired,
    selection: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.setElement = this.setElement.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.state = { timeOffset: this.getTimeOffset() };
  }

  componentDidMount() {
    this.updateTimeInterval = window.setInterval(this.updateTime, 60000);
  }

  componentWillUnmount() {
    window.clearInterval(this.updateTimeInterval);
    this.updateTimeInterval = null;
  }

  getTimeOffset() {
    const now = moment();
    const isToday = now.isSame(this.props.date, 'day');
    if (!isToday) return null;
    const offsetMinutes = now.diff(this.props.date, 'minutes');
    const offsetPixels = (offsetMinutes / slotSize) * slotWidth;
    return offsetPixels;
  }

  setElement(element) {
    this.element = element;
  }

  scrollTo(pixels) {
    if (this.element) this.element.scrollLeft = pixels;
  }

  updateTime() {
    const timeOffset = this.getTimeOffset();
    if (timeOffset !== this.state.timeOffset) {
      this.setState({ timeOffset });
    }
  }

  render() {
    const {
      onReservationSlotClick,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave,
      onSelectionCancel,
      selection,
    } = this.props;
    return (
      <div
        className={classNames('timeline-group', this.props.className)}
        ref={this.setElement}
      >
        {this.state.timeOffset && (
          <div
            className="timeline-group-current-time"
            style={{ left: this.state.timeOffset }}
          />
        )}
        <Sticky>
          <div className="hours">
            {getHourRanges(this.props.date).map(range => (
              <div
                className={classNames('hour', {
                  'hour-start-selected': selection && range.midPoint.isSame(selection.end),
                  'hour-end-selected': selection && range.endTime.isSame(selection.end),
                })}
                key={range.startTime.format('HH')}
                style={{ width: utils.getTimeSlotWidth(range) }}
              >
                {range.startTime.format('HH:mm')}
              </div>
            ))}
          </div>
        </Sticky>
        {this.props.resources.map(resource => (
          <AvailabilityTimelineContainer
            date={this.props.date}
            id={resource}
            key={resource}
            onReservationSlotClick={onReservationSlotClick}
            onReservationSlotMouseEnter={onReservationSlotMouseEnter}
            onReservationSlotMouseLeave={onReservationSlotMouseLeave}
            onSelectionCancel={onSelectionCancel}
            selection={selection}
          />
        ))}
      </div>
    );
  }
}
