import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';

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
        <td>
          <Label bsStyle={slot.reserved ? 'danger' : 'success'}>
            {slot.reserved ? 'Varattu' : 'Vapaa'}
          </Label>
        </td>
      </tr>
    );
  }
}

TimeSlot.propTypes = {
  slot: PropTypes.object.isRequired,
};

export default TimeSlot;
