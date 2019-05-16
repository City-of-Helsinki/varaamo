import has from 'lodash/has';

export const isAccessCodeGenerated = reservation => has(reservation, 'accessCode') && reservation.accessCode !== null;

// eslint-disable-next-line arrow-body-style
export const isAccessCodePending = (reservation, resource) => {
  // resource.generateAccessCodes:
  // true => respa generates an access_code for reservation (immediately)
  // false => an access_code will be generated for reservation 24h before it starts
  return !isAccessCodeGenerated(reservation) && resource.generateAccessCodes === false;
};
