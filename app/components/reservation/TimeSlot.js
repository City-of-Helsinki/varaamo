import React, { Component, PropTypes } from 'react';

export class TimeSlot extends Component {
  render() {
    const { slot } = this.props;

    return (
      <tr className={slot.reserved ? 'reserved' : ''}>
        <td>
          <time dateTime={`${slot.start}/${slot.end}`}>
            {slot.asString}
          </time>
        </td>
        <td>{slot.reserved ? 'Varattu' : 'Vapaa'}</td>
      </tr>
    );
  }
}

TimeSlot.propTypes = {
  slot: PropTypes.object.isRequired,
};

export default TimeSlot;
