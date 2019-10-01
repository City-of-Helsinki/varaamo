import moment from 'moment';
import get from 'lodash/get';

/**
 * getDefaultSelectedTimeRange()
 * Get default selected time range from reservation data.
 * @returns {Object} selected time range
 */
export const getDefaultSelectedTimeRange = (reservation) => {
  return reservation ? {
    start: reservation.begin,
    end: reservation.end
  } : null;
};


/**
 * isTimeRangeOverMaxPeriod();
 * Reservation cannot be longer than the resources max period if max period is set.
 *
 * @param {Object} resource Resource data
 * @param {Date} start Start time
 * @param {Date} end End time
 * @param {boolean} isStaff Bypass this check if user is staff member
 * @returns {boolean} Selected time range is larger than max_period or not
 */
export const isTimeRangeOverMaxPeriod = (resource, start, end, isStaff = false) => {
  const period = get(resource, 'max_period', null);

  if (!isStaff && period) {
    const startMoment = moment(start);
    const endMoment = moment(end);

    const periodDuration = moment.duration(period);
    const durationInMinutes = periodDuration.hours() * 60 + periodDuration.minutes();

    if (endMoment.diff(startMoment, 'minutes') > durationInMinutes) {
      return true;
    }
  }

  return false;
};

/**
 * isTimeRangeUnderMinPeriod();
 * Reservation must longer than the resources min period if min period is set.
 *
 * @param {Object} resource Resource data
 * @param {Date} start Start time
 * @param {Date} end End time
 * @param {boolean} isStaff Bypass this check if user is staff member
 * @returns {boolean} Selected time range is larger than min_period or not
 */
export const isTimeRangeUnderMinPeriod = (resource, start, end) => {
  const period = get(resource, 'min_period', null);

  if (period) {
    const startMoment = moment(start);
    const endMoment = moment(end);

    const periodDuration = moment.duration(period);
    const durationInMinutes = periodDuration.hours() * 60 + periodDuration.minutes();

    if (endMoment.diff(startMoment, 'minutes') < durationInMinutes) {
      return true;
    }
  }

  return false;
};

/**
 * addPeriodToTime()
 * Add period to input time
 * For example: period 00:30:00, time: moment(12:00:00) -> moment(12:30:00)
 *
 * @param {Moment} time
 * @param {string} period
 * @returns {Moment}
 */

const addPeriodToTime = (time, period) => {
  if (period) {
    const periodInMinute = moment.duration(period).as('minutes');
    return time.add(periodInMinute, 'minutes');
  }

  // Return original if no period
  return time;
};

/**
 * getMinPeriodTimeRange
 * Populate the end time with resource min_period
 * For example: start time 1pm, min_period: 1:00:00 ->
 * end time should be 1pm + 1hour = 2pm
 *
 * @param {Object} resource
 * @param {Date} start
 * @param {Date} end
 * @returns {Date} return new end date if time range < min_period given, otherwise return original end
 */

export const getMinPeriodTimeRange = (resource, start, end) => {
  const minPeriod = get(resource, 'min_period', null);

  if (!minPeriod) {
    return {
      start, end
    };
  }

  const minPeriodEnd = addPeriodToTime(moment(start), minPeriod);

  if (minPeriodEnd.diff(moment(end)) > 0) {
    // time range smaller than min_period, return min_period
    return {
      start,
      end: minPeriodEnd.toDate()
    };
  }

  return {
    start,
    end
  };
};

/**
 * getMaxPeriodEndTime
 * Populate the end time with resource min_period
 * For example: start time 1pm, min_period: 1:00:00 ->
 * end time should be 1pm + 1hour = 2pm
 *
 * @param {Object} resource
 * @param {Date} start
 * @param {Date} end
 * @returns {Date} return new end date if time range < min_period given, otherwise return original end
 */

export const getMaxPeriodTimeRange = (resource, start, end) => {
  const maxPeriod = get(resource, 'max_period', null);

  if (!maxPeriod) {
    return {
      start, end
    };
  }

  const maxPeriodEnd = addPeriodToTime(moment(start), maxPeriod);

  if (moment(end).diff(maxPeriodEnd) > 0) {
    // time range is over max_period not allowed, return max_period
    return {
      start,
      end: maxPeriodEnd.toDate()
    };
  }

  return {
    start,
    end
  };
};
