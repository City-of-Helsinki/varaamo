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
      isLoggedIn,
      onClick,
      openReservationDeleteModal,
      pushState,
      resource,
      selected,
      selectReservationToDelete,
      selectReservationToEdit,
      time,
    } = this.props;
    const scrollTo = time && time === slot.start;

    return (
      <TimeSlot
        isLoggedIn={isLoggedIn}
        key={slot.start}
        onClick={onClick}
        openReservationDeleteModal={openReservationDeleteModal}
        pushState={pushState}
        resource={resource}
        scrollTo={scrollTo}
        selected={_.includes(selected, slot.asISOString)}
        selectReservationToEdit={selectReservationToEdit}
        selectReservationToDelete={selectReservationToDelete}
        slot={slot}
      />
    );
  }

  render() {
    const {
      resource,
      isFetching,
      slots,
    } = this.props;
    const isAdmin = resource.userPermissions.isAdmin;

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
          <p>Tila ei ole varattavissa tänä päivänä.</p>
        )}
      </Loader>
    );
  }
}

TimeSlots.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  openReservationDeleteModal: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  selectReservationToDelete: PropTypes.func.isRequired,
  selectReservationToEdit: PropTypes.func.isRequired,
  slots: PropTypes.array.isRequired,
  time: PropTypes.string,
};

export default TimeSlots;
