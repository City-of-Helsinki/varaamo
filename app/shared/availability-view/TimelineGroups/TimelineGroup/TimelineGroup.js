import { slotSize } from 'constants/SlotConstants';

import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Sticky from 'react-sticky-el';

import AvailabilityTimelineContainer from './AvailabilityTimeline';
import utils from './utils';

function getHourRanges(date, range) {
  const ranges = [];
  const start = moment(date).startOf(range);
  const end = moment(date).endOf(range);
  while (start.isBefore(end)) {
    ranges.push({
      startTime: start.clone(),
      midPoint: start.clone().add(0.5, 'day'),
      endTime: start.clone().add(1, 'day'),
    });
    start.add(1, 'day');
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
    range: PropTypes.oneOf(['day', 'week']).isRequired,
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

  componentDidUpdate() {
    window.clearInterval(this.updateTimeInterval);
    this.updateTime();
    this.updateTimeInterval = window.setInterval(this.updateTime, 60000);
  }

  componentWillUnmount() {
    window.clearInterval(this.updateTimeInterval);
    this.updateTimeInterval = null;
  }

  getTimeOffset() {
    const now = moment();
    const within = now.isSame(this.props.date, this.props.range);
    if (!within) return null;
    const timeSlotWidth = utils.getTimeSlotWidth(
      moment.range(now, now.clone().add(slotSize)), this.props.range
    );
    const start = moment(this.props.date).startOf(this.props.range);
    const offsetMinutes = now.diff(start, 'minutes');
    const offsetPixels = (offsetMinutes / slotSize) * timeSlotWidth;

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
      range: rangeMode,
    } = this.props;
    const ranges = getHourRanges(this.props.date, rangeMode);
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
            {ranges.map(range => (
              <div
                className={classNames('hour', {
                  'hour-start-selected': selection && range.midPoint.isSame(selection.end),
                  'hour-end-selected': selection && range.endTime.isSame(selection.end),
                })}
                key={range.startTime.format('DD HH')}
                style={{ width: utils.getTimeSlotWidth(range, rangeMode) }}
              >
                {range.startTime.format('dd D.M')}
              </div>
            ))}
          </div>
        </Sticky>
        {this.props.resources.map(resource => (
          <AvailabilityTimelineContainer
            date={this.props.date}
            id={resource}
            key={resource.concat(rangeMode)}
            onReservationSlotClick={onReservationSlotClick}
            onReservationSlotMouseEnter={onReservationSlotMouseEnter}
            onReservationSlotMouseLeave={onReservationSlotMouseLeave}
            onSelectionCancel={onSelectionCancel}
            range={rangeMode}
            selection={selection}
          />
        ))}
      </div>
    );
  }
}
