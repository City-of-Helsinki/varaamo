import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import moment from 'moment';
import classNames from 'classnames';
import findIndex from 'lodash/findIndex';
import minBy from 'lodash/minBy';
import round from 'lodash/round';

import constants from '../../../../constants/AppConstants';
import injectT from '../../../../i18n/injectT';
import ReservationPopover from '../../../../shared/reservation-popover';
import TimeSlot from './TimeSlot';
import TimeSlotPlaceholder from './TimeSlotPlaceholder';
import utils from '../utils';

class TimeSlots extends Component {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onClear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    selectedDate: PropTypes.string.isRequired,
    slots: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    time: PropTypes.string,
  };

  state = {
    hoveredTimeSlot: null,
  };

  onClear = () => {
    const { onClear } = this.props;
    onClear();
    this.setState(() => ({ hoveredTimeSlot: null }));
  };

  onCancel = () => {
    const { onClick, selected } = this.props;
    if (selected.length < 1) {
      return;
    }
    onClick(selected[0]);
  };

  onMouseEnter = (hoveredTimeSlot) => {
    this.setState(() => ({
      hoveredTimeSlot,
    }));
  };

  onMouseLeave = () => {
    this.setState(() => ({
      hoveredTimeSlot: null,
    }));
  };

  getReservationBegin = () => {
    const { selected } = this.props;
    if (selected.length < 1) {
      return '';
    }

    return selected[0].begin;
  };

  getReservationEnd = () => {
    const { selected } = this.props;
    const { hoveredTimeSlot } = this.state;
    if (selected.length < 1) {
      return '';
    }
    if (!hoveredTimeSlot) {
      return selected[selected.length - 1].end;
    }
    return hoveredTimeSlot.end;
  };

  calculatePlaceholders(selectedDate, slots) {
    const firstTimeSlots = slots
      .map(timeslots => timeslots && timeslots[0])
      .filter(value => !!value && value.end);
    const slotLength = firstTimeSlots[0]
      ? moment(firstTimeSlots[0].end).diff(firstTimeSlots[0].start, 'minutes')
      : constants.TIME_SLOT_DEFAULT_LENGTH;

    if (firstTimeSlots.length === 0) {
      return {
        mobilePlaceholderOffset: 0,
        timeSlotPlaceholderSizes: Array(slots.length).fill(0),
      };
    }

    const earliestTimeSlot = minBy(firstTimeSlots, timeSlot => moment(timeSlot.start).format('HHMM'));
    const dateForTimeComparison = { year: 2000, dayOfYear: 1 };
    const earliestStart = moment(earliestTimeSlot.start).set(dateForTimeComparison);

    const timeSlotPlaceholderSizes = slots.map((slot) => {
      if (!slot[0] || !slot[0].end) {
        return null;
      }
      const currentStart = moment(slot[0].start).set(dateForTimeComparison);
      return round(currentStart.diff(earliestStart, 'minutes') / slotLength);
      // TODO: Please fix me, i have no idea what im doing.
    });

    const selectedDateIndex = findIndex(
      slots,
      slot => !!slot[0] && moment(slot[0].start).format(constants.DATE_FORMAT) === selectedDate
    );

    const mobilePlaceholderSizes = timeSlotPlaceholderSizes
      .slice(selectedDateIndex, selectedDateIndex + 3)
      .filter(size => size !== null);

    const mobilePlaceholderOffset = mobilePlaceholderSizes.length > 0
      ? Math.min(...mobilePlaceholderSizes) : 0;

    return {
      mobilePlaceholderOffset,
      timeSlotPlaceholderSizes,
    };
  }

  renderTimeSlots = () => {
    const {
      selected, selectedDate, slots, resource
    } = this.props;
    let lastSelectableFound = false;

    const { mobilePlaceholderOffset, timeSlotPlaceholderSizes } = this.calculatePlaceholders(
      selectedDate,
      slots
    );

    return slots.map((timeSlots, index) => {
      if (!timeSlots.length) {
        return null;
      }
      const slot = timeSlots[0];
      const lastSlot = timeSlots[timeSlots.length - 1];
      const placeholderSize = timeSlotPlaceholderSizes[index];

      const slotDate = moment(slot.start).format(constants.DATE_FORMAT);
      const nextFromSelectedDate = utils.getNextDayFromDate(selectedDate);
      const secondFromSelectedDate = utils.getSecondDayFromDate(selectedDate);
      const isNextWeek = moment(slot.start).week() !== moment(selectedDate).week();
      const className = classNames('app-TimeSlots--date', {
        'app-TimeSlots--date--selected': slotDate === selectedDate,
        'app-TimeSlots--date--selected--next--day': slotDate === nextFromSelectedDate,
        'app-TimeSlots--date--selected--second--day': slotDate === secondFromSelectedDate,
        'app-TimeSlots--date--selected--next--week': isNextWeek,
      });

      return (
        <div className={className} key={`dateslot-${index}`}>
          <h6 className="app-TimeSlots--date--header">
            {slot && slot.start ? moment(slot.start).format('dd D.M') : ''}
          </h6>

          {!!placeholderSize && (
            <TimeSlotPlaceholder mobileOffset={mobilePlaceholderOffset} size={placeholderSize} />
          )}

          {timeSlots.map((timeSlot) => {
            const isUnderMinPeriod = selected.length ? false : utils.isUnderMinPeriod(
              timeSlot, lastSlot, resource.minPeriod
            );
            // disable this check when time slot selected.

            if (!lastSelectableFound && selected.length && timeSlot.reserved) {
              lastSelectableFound = utils.isSlotAfterSelected(timeSlot, selected);
            }
            return this.renderTimeSlot(timeSlot, lastSelectableFound, isUnderMinPeriod);
          })}
        </div>
      );
    });
  };

  renderTimeSlot = (slot, lastSelectableFound, isUnderMinPeriod) => {
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
    const { hoveredTimeSlot } = this.state;
    if (!slot.end) {
      return (
        <h6 className="app-TimeSlots--closed" key={slot.start}>
          {t('TimeSlots.closedMessage')}
        </h6>
      );
    }
    const scrollTo = time && time === slot.start;
    const isSelectable = utils.isSlotSelectable(
      slot,
      selected,
      resource,
      lastSelectableFound,
      isAdmin
    );
    const isSelected = utils.isSlotSelected(slot, selected);
    const isHoveredSlotSelected = utils.isSlotSelected(hoveredTimeSlot, selected);

    const isFirstSelected = utils.isFirstSelected(slot, selected);
    const shouldShowReservationPopover = hoveredTimeSlot
    && isFirstSelected && !isHoveredSlotSelected;

    const isHighlighted = utils.isHighlighted(slot, selected, hoveredTimeSlot);
    const resBegin = this.getReservationBegin();
    const resEnd = this.getReservationEnd();

    let isMaxExceeded = false;

    if (!isAdmin && resBegin && resource.maxPeriod) {
      const resLengthInMins = moment(slot.end).diff(resBegin, 'minutes');
      const maxPeriodInMins = moment.duration(resource.maxPeriod).asMinutes();
      isMaxExceeded = resLengthInMins > maxPeriodInMins;
    }

    const timeSlot = (
      <TimeSlot
        addNotification={addNotification}
        isAdmin={isAdmin}
        isDisabled={isMaxExceeded}
        isEditing={isEditing}
        isHighlighted={isHighlighted}
        isLoggedIn={isLoggedIn}
        isSelectable={isSelectable}
        isUnderMinPeriod={isUnderMinPeriod}
        key={slot.start}
        onClear={this.onClear}
        onClick={onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        resource={resource}
        scrollTo={scrollTo}
        selected={isSelected}
        showClear={isFirstSelected}
        slot={slot}
      />
    );

    return shouldShowReservationPopover ? (
      <ReservationPopover
        begin={resBegin}
        end={resEnd}
        key="timeslots-reservation-popover"
        onCancel={this.onCancel}
      >
        {timeSlot}
      </ReservationPopover>
    ) : (
      timeSlot
    );
  };

  render() {
    const { isFetching } = this.props;

    return (
      <Loader loaded={!isFetching}>
        <div className="app-TimeSlots">{this.renderTimeSlots()}</div>
      </Loader>
    );
  }
}

TimeSlots = injectT(TimeSlots); // eslint-disable-line

export default TimeSlots;
