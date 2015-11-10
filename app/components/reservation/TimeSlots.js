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
    const { onClick, selected, time } = this.props;
    const scrollTo = time && time === slot.start;

    return (
      <TimeSlot
        key={slot.start}
        onClick={onClick}
        scrollTo={scrollTo}
        selected={_.includes(selected, slot.asISOString)}
        slot={slot}
      />
    );
  }

  render() {
    const { isFetching, slots } = this.props;

    return (
      <Loader loaded={!isFetching}>
        {slots.length ? (
          <Table
            className="time-slots"
            hover
          >
            <thead>
              <tr>
                <th />
                <th>Aika</th>
                <th>Varaustilanne</th>
              </tr>
            </thead>
            <tbody>
              {_.map(slots, this.renderTimeSlot)}
            </tbody>
          </Table>
        ) : (
          <p>Tila ei ole tänään avoinna.</p>
        )}
      </Loader>
    );
  }
}

TimeSlots.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  slots: PropTypes.array.isRequired,
  time: PropTypes.string,
};

export default TimeSlots;
