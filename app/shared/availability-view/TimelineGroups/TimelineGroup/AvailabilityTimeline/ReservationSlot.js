import classNames from 'classnames';
import React, { PropTypes } from 'react';

import utils from '../utils';
import Link from './Link';

export default class ReservationSlot extends React.Component {
  static propTypes = {
    begin: PropTypes.shape({
      format: PropTypes.func.isRequired,
      isSameOrAfter: PropTypes.func.isRequired,
    }).isRequired,
    end: PropTypes.shape({
      format: PropTypes.func.isRequired,
      isSameOrBefore: PropTypes.func.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    resourceId: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  getSlotInfo() {
    return {
      begin: this.props.begin.format(),
      end: this.props.end.format(),
      resourceId: this.props.resourceId,
    };
  }

  handleClick(event) {
    if (this.props.onClick) {
      event.preventDefault();
      this.props.onClick(this.getSlotInfo());
    }
  }

  handleMouseEnter() {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.getSlotInfo());
    }
  }

  handleMouseLeave() {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(this.getSlotInfo());
    }
  }

  render() {
    const selection = this.props.selection;
    const isSelected = selection && (
      this.props.begin.isSameOrAfter(selection.begin) &&
      this.props.end.isSameOrBefore(selection.end) &&
      (!selection.resourceId || selection.resourceId === this.props.resourceId)
    );
    return (
      <Link
        className={classNames('reservation-slot', { 'reservation-slot-selected': isSelected })}
        onClick={this.handleClick}
        style={{ width: utils.getTimeSlotWidth() }}
      >
        <span className="a11y-text">Make reservation</span>
      </Link>
    );
  }
}
