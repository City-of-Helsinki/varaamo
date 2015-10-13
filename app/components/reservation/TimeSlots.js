import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import TimeSlot from 'components/reservation/TimeSlot';

export class TimeSlots extends Component {
  constructor(props) {
    super(props);
    this.renderTimeSlot = this.renderTimeSlot.bind(this);
  }

  renderTimeSlot(slot) {
    return (
      <TimeSlot
        key={slot.start}
        slot={slot}
      />
    );
  }

  render() {
    const { isFetching, slots } = this.props;

    return (
      <Loader loaded={!isFetching}>
        {slots.length ? (
          <Table striped>
            <thead>
              <tr>
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
  isFetching: PropTypes.bool,
  slots: PropTypes.array.isRequired,
};

export default TimeSlots;
