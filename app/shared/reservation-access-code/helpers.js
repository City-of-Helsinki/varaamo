import has from 'lodash/has';

export const isAccessCodeGenerated = reservation => has(reservation, 'access_code') && reservation.access_code !== null;

// eslint-disable-next-line arrow-body-style
export const isAccessCodePending = (reservation, resource) => {
  // resource.generateAccessCodes:
  // true => respa generates an access_code for reservation (immediately)
  // false => an access_code will be generated for reservation 24h before it starts
  return !isAccessCodeGenerated(reservation) && resource.generate_access_codes === false;
};

export const isReservationCancelled = reservation => reservation.state === 'cancelled';
