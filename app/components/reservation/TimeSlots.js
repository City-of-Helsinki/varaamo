import map from 'lodash/collection/map';
import includes from 'lodash/collection/includes';
import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import Loader from 'react-loader';

import TimeSlot from 'components/reservation/TimeSlot';

class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.renderTimeSlot = this.renderTimeSlot.bind(this);
  }

  renderTimeSlot(slot) {
    const {
      addNotification,
      isEditing,
      isLoggedIn,
      onClick,
      openReservationCancelModal,
      openReservationInfoModal,
      updatePath,
      resource,
      selected,
      selectReservationToCancel,
      selectReservationToEdit,
      selectReservationToShow,
      time,
    } = this.props;
    const scrollTo = time && time === slot.start;

    return (
      <TimeSlot
        addNotification={addNotification}
        isEditing={isEditing}
        isLoggedIn={isLoggedIn}
        key={slot.start}
        onClick={onClick}
        openReservationCancelModal={openReservationCancelModal}
        openReservationInfoModal={openReservationInfoModal}
        updatePath={updatePath}
        resource={resource}
        scrollTo={scrollTo}
        selected={includes(selected, slot.asISOString)}
        selectReservationToEdit={selectReservationToEdit}
        selectReservationToCancel={selectReservationToCancel}
        selectReservationToShow={selectReservationToShow}
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
            responsive
          >
            <thead>
              <tr>
                <th />
                <th>Aika</th>
                <th>Varaustilanne</th>
                {isAdmin && <th>Varaaja</th>}
                {isAdmin && <th>Kommentit</th>}
                {isAdmin && <th>Toiminnot</th>}
              </tr>
            </thead>
            <tbody>
              {map(slots, this.renderTimeSlot)}
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
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  openReservationCancelModal: PropTypes.func.isRequired,
  openReservationInfoModal: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  selectReservationToCancel: PropTypes.func.isRequired,
  selectReservationToEdit: PropTypes.func.isRequired,
  selectReservationToShow: PropTypes.func.isRequired,
  slots: PropTypes.array.isRequired,
  time: PropTypes.string,
};

export default TimeSlots;
