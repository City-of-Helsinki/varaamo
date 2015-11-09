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
    const { onChange, selected } = this.props;

    return (
      <TimeSlot
        key={slot.start}
        onChange={onChange}
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
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  slots: PropTypes.array.isRequired,
};

export default TimeSlots;
