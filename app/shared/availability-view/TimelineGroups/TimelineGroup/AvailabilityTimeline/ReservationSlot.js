import classNames from 'classnames';
import React, { PropTypes } from 'react';

import utils from '../utils';
import Link from './Link';

export default class ReservationSlot extends React.Component {
  static propTypes = {
    begin: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    resourceId: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const isSelected = this.getIsSelected(nextProps.selection);
    const wasSelected = this.getIsSelected(this.props.selection);
    return isSelected !== wasSelected;
  }

  getIsSelected(selection) {
    return selection && (
      (!selection.resourceId || selection.resourceId === this.props.resourceId) &&
      this.props.begin >= selection.begin &&
      this.props.end <= selection.end
    );
  }

  getSlotInfo() {
    return {
      begin: this.props.begin,
      end: this.props.end,
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
    const isSelected = this.getIsSelected(this.props.selection);
    return (
      <Link
        className={classNames('reservation-slot', { 'reservation-slot-selected': isSelected })}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{ width: utils.getTimeSlotWidth() }}
      >
        <span className="a11y-text">Make reservation</span>
      </Link>
    );
  }
}
