import client from '../../../src/common/api/client';

/**
 * Get reservation detail
 *
 * @param {Object} filters Filters
 * @returns {Promise}
 */
export const getReservationDetail = (reservationId) => {
  return client.get(`reservation/${reservationId}`, { include: 'reservation_detail', });
};
