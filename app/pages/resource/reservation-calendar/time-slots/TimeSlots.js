import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';

import TimeSlot from './TimeSlot';

class TimeSlots extends Component {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    slots: PropTypes.array.isRequired,
    time: PropTypes.string,
  };

  renderTimeSlot = (slot) => {
    const {
      addNotification,
      isAdmin,
      isEditing,
      isLoggedIn,
      onClick,
      resource,
      selected,
      time,
    } = this.props;
    const scrollTo = time && time === slot.start;

    return (
      <TimeSlot
        addNotification={addNotification}
        isAdmin={isAdmin}
        isEditing={isEditing}
        isLoggedIn={isLoggedIn}
        key={slot.start}
        onClick={onClick}
        resource={resource}
        scrollTo={scrollTo}
        selected={includes(selected, slot.asISOString)}
        slot={slot}
      />
    );
  }

  render() {
    const { isFetching, slots } = this.props;

    return (
      <Loader loaded={!isFetching}>
        <div className="app-TimeSlots">
          {slots.map(this.renderTimeSlot)}
        </div>
      </Loader>
    );
  }
}

export default TimeSlots;
