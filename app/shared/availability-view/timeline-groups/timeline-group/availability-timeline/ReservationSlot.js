import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../../../../i18n/injectT';
import ReservationPopover from '../../../../reservation-popover/ReservationPopover';

export class UninjectedReservationSlot extends React.Component {
  static propTypes = {
    begin: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    isSelectable: PropTypes.bool.isRequired,
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
    const isSelectableChanged = this.props.isSelectable !== nextProps.isSelectable;
    return (
      isSelectableChanged
      || isSelected !== wasSelected
      || this.shouldShowPopover(wasSelected, nextProps)
    );
  }

  getIsSelected(selection = this.props.selection) {
    return (
      selection
      && ((!selection.resourceId || selection.resourceId === this.props.resourceId)
        && this.props.begin >= selection.begin
        && this.props.end <= selection.end)
    );
  }

  getSlotInfo() {
    return {
      begin: this.props.begin,
      end: this.props.end,
      resourceId: this.props.resourceId,
    };
  }

  shouldShowPopover(isSelected, props = this.props) {
    return isSelected && !props.selection.hover && props.selection.begin === props.begin;
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
    return (
      <ReservationPopover
        begin={this.props.selection.begin}
        end={this.props.selection.end}
        onCancel={this.props.onSelectionCancel}
      />
    );
  }
}

export default injectT(UninjectedReservationSlot);
