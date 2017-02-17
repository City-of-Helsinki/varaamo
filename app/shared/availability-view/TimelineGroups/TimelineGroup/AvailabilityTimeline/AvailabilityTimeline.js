import React, { PropTypes } from 'react';

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
    selection: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleReservationSlotClick = this.handleReservationSlotClick.bind(this);
  }

  handleReservationSlotClick(data) {
    if (this.props.onReservationSlotClick) {
      this.props.onReservationSlotClick({ resourceId: this.props.id, ...data });
    }
  }

  render() {
    const { onReservationClick, selection } = this.props;
    return (
      <div className="availability-timeline">
        {this.props.items.map((item) => {
          if (item.type === 'reservation-slot') {
            return (
              <ReservationSlot
                {...item.data}
                key={item.key}
                onClick={this.handleReservationSlotClick}
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
