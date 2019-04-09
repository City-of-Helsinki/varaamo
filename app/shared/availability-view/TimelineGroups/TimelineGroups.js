import dragscroll from 'dragscroll';
import throttle from 'lodash/throttle';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import TimelineGroup from './TimelineGroup';
import utils from './TimelineGroup/utils';

function scrollToInitial(element) {
  if (element) {
    const initialScroll = utils.getTimeSlotWidth({
      startTime: moment('2016-01-01T00:00:00'),
      endTime: moment('2016-01-01T08:00:00'),
    });
    element.scrollLeft = initialScroll; // eslint-disable-line no-param-reassign
  }
}

const scrollStickies = (function () { // eslint-disable-line func-names
  function scroll(scrollContainer) {
    const stickies = Array.from(scrollContainer.querySelectorAll('.sticky'));
    stickies.forEach((sticky) => {
      sticky.scrollLeft = scrollContainer.scrollLeft; // eslint-disable-line no-param-reassign
    });
  }
  return throttle(scroll, 10);
}());

export default class TimelineGroups extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseLeave: PropTypes.func,
    onSelectionCancel: PropTypes.func,
    selection: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.element = null;
    this.setElement = this.setElement.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    dragscroll.reset();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  setElement(element) {
    this.element = element;
    scrollToInitial(element);
  }

  handleScroll() {
    if (this.element) {
      scrollStickies(this.element);
    }
  }

  render() {
    return (
      <div
        className="dragscroll timeline-groups"
        onScroll={this.handleScroll}
        ref={this.setElement}
      >
        {this.props.groups.map(group => (
          <TimelineGroup
            date={this.props.date}
            key={group.name}
            onReservationSlotClick={this.props.onReservationSlotClick}
            onReservationSlotMouseEnter={this.props.onReservationSlotMouseEnter}
            onReservationSlotMouseLeave={this.props.onReservationSlotMouseLeave}
            onSelectionCancel={this.props.onSelectionCancel}
            selection={this.props.selection}
            {...group}
          />
        ))}
      </div>
    );
  }
}
