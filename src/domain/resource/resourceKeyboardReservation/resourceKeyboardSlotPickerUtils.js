/**
 * getInMS();
 * Returns the millisecond representation of time parts.
 *
 * @param {number} [hours=0]
 * @param {number} [minutes=0]
 * @param {number} [seconds=0]
 * @param {number} [milliSeconds=0]
 * @returns {number}
 */
export function getInMs(hours = 0, minutes = 0, seconds = 0, milliSeconds = 0) {
  const hoursInMs = hours * 60 * 60 * 1000;
  const minutesInMs = minutes * 60 * 1000;
  const secondsInMs = seconds * 1000;

  return hoursInMs + minutesInMs + secondsInMs + milliSeconds;
}

function getSlotSizeInTime(slotSize) {
  const [hours, minutes] = slotSize.split(':');

  return getInMs(hours, minutes);
}

/**
 * getSlots();
 * Build slots for time period based on given inputs
 *
 * @param {string} startTime
 * @param {string} endTime
 * @param {string} slotSize
 * @returns {array}
 */
export function getSlots(startTime, endTime, slotSize) {
  const slotSizeInMs = getSlotSizeInTime(slotSize);
  const statTimeInMs = new Date(startTime).getTime();
  const endTimeInMs = new Date(endTime).getTime();
  const slotCount = Number(
    // Count how many slot sizes can be fit between start and end times.
    // Use .toFixed to round the final result and ignore the possible
    // error in floating point math.
    ((new Date(endTimeInMs).getTime() - statTimeInMs) / slotSizeInMs).toFixed(0),
  );
  const slots = Array.from({ length: slotCount }, (_, index) => {
    const slotStartTime = statTimeInMs + index * slotSizeInMs;
    // Leave one ms short from the next begin time in order to avoid
    // overlap between slots.
    const slotEndTime = slotStartTime + (slotSizeInMs - 1);

    return {
      start:
        new Date(slotStartTime).toJSON(),
      end: new Date(slotEndTime).toJSON(),
    };
  });

  return slots;
}

/**
 * getIsSlotReserved();
 * Returns true if there's a reservation that overlaps with the slot,
 * returns false otherwise.
 *
 * @param {object} slot
 * @param {array} reservations
 * @returns {boolean}
 */
export function getIsSlotReserved(slot, reservations) {
  return reservations.reduce((acc, reservation) => {
    const timeInSlot = new Date(new Date(slot.start).getTime() + 1);

    const isReserved = new Date(reservation.begin).getTime() < timeInSlot.getTime()
      && new Date(reservation.end).getTime() > timeInSlot.getTime();

    return acc || isReserved;
  }, false);
}

/**
 * getIsSlotInPast();
 * Returns true when the slot is in the past.
 *
 * @param {object} slot
 * @returns {boolean}
 */
export function getIsSlotInPast(slot) {
  const currentTime = new Date().getTime();

  return new Date(slot.start).getTime() < currentTime;
}

/**
 * getNextFreeSlot();
 * Returns the next slot that hasn't yet started and which isn't
 * reserved.
 *
 * @param {array} slots
 * @param {array} reservations
 * @returns {object}
 */
export function getNextFreeSlot(slots, reservations) {
  const upComingFreeSlots = slots
    .filter(slot => !getIsSlotInPast(slot))
    .filter(slot => !getIsSlotReserved(slot, reservations));

  if (upComingFreeSlots && upComingFreeSlots.length >= 1) {
    return upComingFreeSlots[0];
  }

  return {
    start: null,
    end: null,
  };
}
