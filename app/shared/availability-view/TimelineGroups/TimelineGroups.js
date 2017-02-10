import dragscroll from 'dragscroll';
import moment from 'moment';
import React, { PropTypes } from 'react';

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

export default class TimelineGroups extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  componentDidMount() {
    dragscroll.reset();
  }

  render() {
    return (
      <div
        className="dragscroll timeline-groups"
        ref={scrollToInitial}
      >
        {this.props.groups.map(group =>
          <TimelineGroup date={this.props.date} key={group.name} {...group} />
        )}
      </div>
    );
  }
}
