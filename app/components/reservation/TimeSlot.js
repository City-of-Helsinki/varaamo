import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Glyphicon, Label } from 'react-bootstrap';

class TimeSlot extends Component {
  render() {
    const { onChange, selected, slot } = this.props;
    const isPast = moment(slot.end) < moment();
    const disabled = !slot.editing && (slot.reserved || isPast);
    const checked = selected || (slot.reserved && !slot.editing);
    let labelBsStyle;
    if (isPast) {
      labelBsStyle = 'default';
    } else {
      labelBsStyle = slot.reserved ? 'danger' : 'success';
    }

    return (
      <tr
        className={classNames({
          disabled,
          editing: slot.editing,
          'past': isPast,
          reserved: slot.reserved,
          selected,
        })}
        onClick={() => !disabled && onChange(slot.asISOString)}
      >
        <td className="checkbox-cell">
          <Glyphicon glyph={checked ? 'check' : 'unchecked'} />
        </td>
        <td className="time-cell">
          <time dateTime={slot.asISOString}>
            {slot.asString}
          </time>
        </td>
        <td>
          <Label bsStyle={labelBsStyle}>
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
