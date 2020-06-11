import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import injectT from '../../../../../i18n/injectT';
import ReservationPopover from '../../../../reservation-popover/ReservationPopover';
import utils from '../utils';

export class UninjectedReservationSlot extends React.Component {
  static propTypes = {
    begin: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    itemIndex: PropTypes.number,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onSelectionCancel: PropTypes.func,
    resourceId: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      hover: PropTypes.bool,
      resourceId: PropTypes.string.isRequired,
    }),
    slotSize: PropTypes.string,
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
    const isSelectableChanged =
      this.props.isSelectable !== nextProps.isSelectable;
    return (
      isSelectableChanged ||
      isSelected !== wasSelected ||
      this.shouldShowPopover(wasSelected, nextProps)
    );
  }

  getIsSelected(selection = this.props.selection) {
    return (
      selection &&
      (!selection.resourceId ||
        selection.resourceId === this.props.resourceId) &&
      this.props.begin >= selection.begin &&
      this.props.end <= selection.end
    );
  }

  getSlotInfo() {
    const { end, slotSize } = this.props;
    const slotDuration = moment.duration(slotSize).hours();
    const slotDivider = moment.duration(slotSize).hours() * 2 - 1;
    const slotEnd =
      slotDuration < 1
        ? end
        : moment(end)
            .add(30 * slotDivider, 'minutes')
            .format('YYYY-MM-DDTHH:mm:ss');
    return {
      begin: this.props.begin,
      end: slotEnd,
      resourceId: this.props.resourceId,
    };
  }

  shouldShowPopover(isSelected, props = this.props) {
    return (
      isSelected &&
      !props.selection.hover &&
      props.selection.begin === props.begin
    );
  }

  handleClick(event) {
    if (this.props.onClick && this.props.isSelectable) {
      event.preventDefault();
      this.props.onClick(this.getSlotInfo());
    } else if (this.props.onSelectionCancel && !this.props.isSelectable) {
      event.preventDefault();
      this.props.onSelectionCancel();
    }
  }

  handleMouseEnter() {
    if (this.props.onMouseEnter && this.props.isSelectable) {
      this.props.onMouseEnter(this.getSlotInfo());
    }
  }

  handleMouseLeave() {
    if (this.props.onMouseLeave && this.props.isSelectable) {
      this.props.onMouseLeave(this.getSlotInfo());
    }
  }

  render() {
    const { itemIndex, slotSize } = this.props;
    const slotDuration = moment.duration(slotSize).hours();
    const divideIndex = slotDuration * 2;
    const isSelected = this.getIsSelected();
    const slot = (
      <button
        className={classNames('reservation-slot', {
          'reservation-slot-selected': isSelected,
          'reservation-slot-selectable': this.props.isSelectable,
        })}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{
          width:
            slotDuration < 1
              ? utils.getTimeSlotWidth()
              : utils.getTimeSlotWidth() * divideIndex,
        }}
        type="button"
      >
        <span className="a11y-text" />
      </button>
    );
    if (this.shouldShowPopover(isSelected)) {
      return (
        <ReservationPopover
          begin={this.props.selection.begin}
          end={this.props.selection.end}
          onCancel={this.props.onSelectionCancel}
        >
          {slot}
        </ReservationPopover>
      );
    }
    return (
      <>
        {slotDuration > 0 && itemIndex % divideIndex === 0 && slot}
        {slotDuration > 0 && itemIndex % divideIndex > 0 && <span />}
        {slotDuration < 1 && slot}
      </>
    );
  }
}

export default injectT(UninjectedReservationSlot);
