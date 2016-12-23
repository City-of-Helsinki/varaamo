import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import Loader from 'react-loader';

import { injectT } from 'i18n';
import TimeSlot from './TimeSlot';

class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.renderTimeSlot = this.renderTimeSlot.bind(this);
  }

  renderTimeSlot(slot) {
    const {
      addNotification,
      isAdmin,
      isEditing,
      isLoggedIn,
      isStaff,
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
        isStaff={isStaff}
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
    const {
      isAdmin,
      isFetching,
      slots,
      t,
    } = this.props;

    return (
      <Loader loaded={!isFetching}>
        <Table
          className="time-slots lined"
          hover
          responsive
        >
          <thead>
            <tr>
              <th />
              <th>{t('TimeSlots.time')}</th>
              <th>{t('TimeSlots.reservations')}</th>
              {!isAdmin && <th />}
              {isAdmin && <th>{t('TimeSlots.reserver')}</th>}
              {isAdmin && <th>{t('TimeSlots.comments')}</th>}
              {isAdmin && <th>{t('TimeSlots.controls')}</th>}
            </tr>
          </thead>
          <tbody>
            {slots.map(this.renderTimeSlot)}
          </tbody>
        </Table>
      </Loader>
    );
  }
}

TimeSlots.propTypes = {
  addNotification: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  slots: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  time: PropTypes.string,
};

export default injectT(TimeSlots);
