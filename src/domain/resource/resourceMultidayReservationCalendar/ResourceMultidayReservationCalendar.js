import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';

import DateRangePicker from '../../../common/date-range/DateRangePicker';
import { resourcePeriodLengthType } from '../constants';
import DateRangeLegend from '../../../common/date-range/legend/DateRangeLegend';

const ResourceMultidayReservationCalendar = ({
  date,
  onDateChange,
  onSelectedRangeChange,
  resource,
  reservationLengthType,
}) => {
  if (!resource || !resource.periods) {
    return null;
  }

  const filteredPeriods = resource.periods.filter(
    period => period.reservationLengthType === reservationLengthType,
  );

  const openingPeriods = filteredPeriods.map(period => ({
    from: new Date(period.start),
    to: new Date(period.end),
    durationUnit: period.multidaySettings.durationUnit,
    minDuration: period.multidaySettings.minDuration,
    maxDuration: period.multidaySettings.maxDuration,
    endingTime: {
      hours: moment.duration(period.multidaySettings.checkOutTime).hours(),
      min: moment.duration(period.multidaySettings.checkOutTime).minutes(),
    },
    startingTime: {
      hours: moment.duration(period.multidaySettings.checkInTime).hours(),
      min: moment.duration(period.multidaySettings.checkInTime).minutes(),
    },
  }));

  const reservations = resource.reservations.map(reservation => ({
    from: new Date(reservation.begin),
    to: new Date(reservation.end),
  }));

  const startingDays = filteredPeriods.reduce(
    (acc, period) => [
      ...acc,
      ...period.multidaySettings.startDays.map(day => new Date(day)),
    ],
    [],
  );

  return (
    <DateRangePicker
      fullDay={reservationLengthType === resourcePeriodLengthType.WHOLE_DAY}
      initialMonth={new Date(date)}
      onMonthChange={onDateChange}
      onRangeSelect={onSelectedRangeChange}
      openingPeriods={openingPeriods}
      renderChildComponent={() => <DateRangeLegend />}
      reservations={reservations}
      startingDays={startingDays}
    />
  );
};

ResourceMultidayReservationCalendar.propTypes = {
  date: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onSelectedRangeChange: PropTypes.func.isRequired,
  resource: PropTypes.object,
  reservationLengthType: PropTypes.oneOf(
    Object.values([
      resourcePeriodLengthType.WHOLE_DAY,
      resourcePeriodLengthType.OVERNIGHT,
    ]),
  ).isRequired,
};

export default ResourceMultidayReservationCalendar;
