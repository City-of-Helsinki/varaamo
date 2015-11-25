import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import TimeSlot from 'components/reservation/TimeSlot';

class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.renderTimeSlot = this.renderTimeSlot.bind(this);
  }

  renderTimeSlot(slot) {
    const {
      isAdmin,
      isLoggedIn,
      onClick,
      openReservationDeleteModal,
      selected,
      selectReservationToDelete,
      time,
    } = this.props;
    const scrollTo = time && time === slot.start;

    return (
      <TimeSlot
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        key={slot.start}
        onClick={onClick}
        openReservationDeleteModal={openReservationDeleteModal}
        scrollTo={scrollTo}
        selected={_.includes(selected, slot.asISOString)}
        selectReservationToDelete={selectReservationToDelete}
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
          >
            <thead>
              <tr>
                <th />
                <th>Aika</th>
                <th>Varaustilanne</th>
                {isAdmin && <th>Varaaja</th>}
                {isAdmin && <th>Toiminnot</th>}
              </tr>
            </thead>
            <tbody>
              {_.map(slots, this.renderTimeSlot)}
            </tbody>
          </Table>
        ) : (
          <p>Tila ei ole tänä päivänä avoinna.</p>
        )}
      </Loader>
    );
  }
}

TimeSlots.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  openReservationDeleteModal: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  selectReservationToDelete: PropTypes.func.isRequired,
  slots: PropTypes.array.isRequired,
  time: PropTypes.string,
};

export default TimeSlots;
