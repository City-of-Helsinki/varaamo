import classNames from 'classnames';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Glyphicon, Label } from 'react-bootstrap';

import { scrollTo } from 'utils/DOMUtils';

class TimeSlot extends Component {
  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(findDOMNode(this));
    }
  }

  render() {
    const { isLoggedIn, onClick, selected, slot } = this.props;
    const isPast = moment(slot.end) < moment();
    const disabled = !isLoggedIn || !slot.editing && (slot.reserved || isPast);
    const checked = selected || (slot.reserved && !slot.editing);
    let labelBsStyle;
    let labelText;
    if (isPast) {
      labelBsStyle = 'default';
    } else {
      labelBsStyle = slot.reserved ? 'danger' : 'success';
    }
    if (slot.editing) {
      labelBsStyle = 'info';
      labelText = 'Muokataan';
    } else {
      labelText = slot.reserved ? 'Varattu' : 'Vapaa';
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
        onClick={() => !disabled && onClick(slot.asISOString)}
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
            {labelText}
          </Label>
        </td>
      </tr>
    );
  }
}

TimeSlot.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  scrollTo: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
  slot: PropTypes.object.isRequired,
};

export default TimeSlot;
