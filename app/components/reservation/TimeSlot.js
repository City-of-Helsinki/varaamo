import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';

class TimeSlot extends Component {
  render() {
    const { onChange, selected, slot } = this.props;
    const disabled = !slot.editing && (slot.reserved || moment(slot.end) < moment());
    const checked = selected || (slot.reserved && !slot.editing);

    return (
      <tr
        className={classNames({
          disabled,
          editing: slot.editing,
          reserved: slot.reserved,
          selected,
        })}
        onClick={() => !disabled && onChange(slot.asISOString)}
      >
        <td className="checkbox-cell">
          <Glyphicon glyph={checked ? 'check' : 'unchecked'} />
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
