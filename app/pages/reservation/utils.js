import client from '../../../src/common/api/client';

/**
 * Get reservation detail
 *
 * @param {Object} reservationId Filters
 * @returns {Promise}
 */
export const getReservationById = (reservationId) => {
  return client.get(`reservation/${reservationId}`);
};

/**
 * Get resource detail
 *
 * @param {Object} filters Filters
 * @returns {Promise}
 */
export const getResourceById = (resourceId) => {
  return client.get(`resource/${resourceId}`);
};
