import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';

export class TimeSlot extends Component {
  render() {
    const { onChange, selected, slot } = this.props;

    return (
      <tr className={slot.reserved ? 'reserved' : ''}>
        <td style={{ textAlign: 'center' }}>
          <input
            checked={slot.reserved || selected}
            disabled={slot.reserved}
            onChange={() => onChange(slot.asISOString)}
            type="checkbox"
          />
        </td>
        <td>
          <time dateTime={slot.asISOString}>
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
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  slot: PropTypes.object.isRequired,
};

export default TimeSlot;
