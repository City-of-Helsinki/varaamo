import React, { Component, PropTypes } from 'react';

export class TimeSlot extends Component {
  render() {
    const { slot, isReserved } = this.props;

    return (
      <tr className={isReserved ? 'reserved' : ''}>
        <td>
          <time dateTime={`${slot.start}/${slot.end}`}>
            {slot.asString}
          </time>
        </td>
        <td>{isReserved ? 'Varattu' : 'Vapaa'}</td>
      </tr>
    );
  }
}

TimeSlot.propTypes = {
  isReserved: PropTypes.bool,
  slot: PropTypes.object.isRequired,
};

export default TimeSlot;
