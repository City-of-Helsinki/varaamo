import PropTypes from 'prop-types';
import React from 'react';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

export default class AvailabilityTimeline extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['reservation', 'reservation-slot']).isRequired,
        data: PropTypes.object,
      })
    ).isRequired,
    onReservationClick: PropTypes.func,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseLeave: PropTypes.func,
    onSelectionCancel: PropTypes.func,
    selection: PropTypes.object,
  };

  shouldComponentUpdate(nextProps) {
    const isSelected = nextProps.selection && nextProps.selection.resourceId === this.props.id;
    const wasSelected = this.props.selection && this.props.selection.resourceId === this.props.id;
    return this.props.items !== nextProps.items || isSelected || wasSelected;
  }

  render() {
    const {
      onReservationClick,
      onReservationSlotClick,
      onSelectionCancel,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave,
      selection,
    } = this.props;
    return (
      <div className="availability-timeline">
        {this.props.items.map((item) => {
          if (item.type === 'reservation-slot') {
            return (
              <ReservationSlot
                {...item.data}
                key={item.key}
                onClick={onReservationSlotClick}
                onMouseEnter={onReservationSlotMouseEnter}
                onMouseLeave={onReservationSlotMouseLeave}
                onSelectionCancel={onSelectionCancel}
                resourceId={this.props.id}
                selection={selection}
              />
            );
          }
          return (
            <Reservation
              {...item.data}
              key={item.key}
              onClick={onReservationClick}
            />
          );
        })}
      </div>
    );
  }
}
