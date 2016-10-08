import includes from 'lodash/includes';
import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import Loader from 'react-loader';

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
    } = this.props;

    return (
      <Loader loaded={!isFetching}>
        {slots.length ? (
          <Table
            className="time-slots lined"
            hover
            responsive
          >
            <thead>
              <tr>
                <th />
                <th>Aika</th>
                <th>Varaustilanne</th>
                {!isAdmin && <th />}
                {isAdmin && <th>Varaaja</th>}
                {isAdmin && <th>Kommentit</th>}
                {isAdmin && <th>Toiminnot</th>}
              </tr>
            </thead>
            <tbody>
              {slots.map(this.renderTimeSlot)}
            </tbody>
          </Table>
        ) : (
          <p>Tila ei ole varattavissa tänä päivänä.</p>
        )}
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
  time: PropTypes.string,
};

export default TimeSlots;
