import React, { PropTypes } from 'react';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

AvailabilityTimeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['reservation', 'reservation-slot']).isRequired,
      data: PropTypes.object,
    })
  ).isRequired,
  onReservationClick: PropTypes.func.isRequired,
  onReservationSlotClick: PropTypes.func,
  selection: PropTypes.object,
};

export default function AvailabilityTimeline(props) {
  const { onReservationClick, onReservationSlotClick, selection } = props;
  return (
    <div className="availability-timeline">
      {props.items.map((item) => {
        if (item.type === 'reservation-slot') {
          return (
            <ReservationSlot
              {...item.data}
              key={item.key}
              onClick={onReservationSlotClick}
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
