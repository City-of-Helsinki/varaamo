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
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) {
      event.preventDefault();
      this.props.onClick({
        begin: this.props.begin.format(),
        end: this.props.end.format(),
      });
    }
  }

  render() {
    const isSelected = this.props.selection && (
      this.props.begin.isSameOrAfter(this.props.selection.begin) &&
      this.props.end.isSameOrBefore(this.props.selection.end)
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
