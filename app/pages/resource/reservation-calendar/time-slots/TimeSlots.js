import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import moment from 'moment';
import classnames from 'classnames';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';
import TimeSlot from './TimeSlot';
import utils from '../utils';

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
    selectedDate: PropTypes.string.isRequired,
    slots: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    time: PropTypes.string,
  };

  renderTimeSlots = () => {
    const { selected, selectedDate, slots } = this.props;
    let lastSelectableFound = false;

    return slots.map((timeSlots, index) => {
      if (!timeSlots.length) {
        return null;
      }
      const slot = timeSlots.length ? timeSlots[0] : null;
      const slotDate = moment(slot.start).format(constants.DATE_FORMAT);
      const nextFromSelectedDate = utils.getNextDayFromDate(selectedDate);
      const secondFromSelectedDate = utils.getSecondDayFromDate(selectedDate);
      const isNextWeek = moment(slot.start).week() !== moment(selectedDate).week();
      return (
        <div
          className={classnames('app-TimeSlots--date', {
            'app-TimeSlots--date--selected': slotDate === selectedDate,
            'app-TimeSlots--date--selected--next--day': slotDate === nextFromSelectedDate,
            'app-TimeSlots--date--selected--second--day': slotDate === secondFromSelectedDate,
            'app-TimeSlots--date--selected--next--week': isNextWeek,
          })}
          key={`dateslot-${index}`}
        >
          <h6>{slot && slot.start ? moment(slot.start).format('dd D.M') : ''}</h6>
          {timeSlots.map((timeSlot) => {
            if (!lastSelectableFound && selected.length && timeSlot.reserved) {
              lastSelectableFound = utils.isSlotAfterSelected(timeSlot, selected);
            }
            return this.renderTimeSlot(timeSlot, lastSelectableFound);
          })}
        </div>
      );
    });
  }

  renderTimeSlot = (slot, lastSelectableFound) => {
    const {
      addNotification,
      isAdmin,
      isEditing,
      isLoggedIn,
      onClick,
      resource,
      selected,
      t,
      time,
    } = this.props;
    if (!slot.end) {
      return (
        <h6 className="app-TimeSlots--closed" key={slot.start}>
          {t('TimeSlots.closedMessage')}
        </h6>
      );
    }
    const scrollTo = time && time === slot.start;
    const isSelectable = utils.isSlotSelectable(slot, selected, resource,
      lastSelectableFound, isAdmin);
    const isSelected = utils.isSlotSelected(slot, selected);
    return (
      <TimeSlot
        addNotification={addNotification}
        isAdmin={isAdmin}
        isEditing={isEditing}
        isLoggedIn={isLoggedIn}
        isSelectable={isSelectable}
        key={slot.start}
        onClick={onClick}
        resource={resource}
        scrollTo={scrollTo}
        selected={isSelected}
        slot={slot}
      />
    );
  }

  render() {
    const { isFetching } = this.props;

    return (
      <Loader loaded={!isFetching}>
        <div className="app-TimeSlots">
          {this.renderTimeSlots()}
        </div>
      </Loader>
    );
  }
}

TimeSlots = injectT(TimeSlots);  // eslint-disable-line

export default TimeSlots;
