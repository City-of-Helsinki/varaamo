import React, { PropTypes } from 'react';

export default function TimeSlotPlaceholder({ mobileOffset, size }) {
  return (
    <div
      className={`app-TimeSlotPlaceholder app-TimeSlotPlaceholder--mobile-offset-${mobileOffset}`}
    >
      {Array(size)
        .fill()
        .map((_, placeholderIndex) => (
          <button
            className="app-TimeSlot app-TimeSlot--placeholder"
            disabled
            key={`timeslot-placeholder-${placeholderIndex}`}
          />
        ))}
    </div>
  );
}

TimeSlotPlaceholder.propTypes = {
  mobileOffset: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
};
