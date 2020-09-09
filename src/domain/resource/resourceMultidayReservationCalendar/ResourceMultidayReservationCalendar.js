import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';

import DateRangePicker from '../../../common/date-range/DateRangePicker';
import { reservationLengthType } from '../constants';
import DateRangeLegend from '../../../common/date-range/legend/DateRangeLegend';

const ResourceMultidayReservationCalendar = ({
  date,
  onDateChange,
  onSelectedRangeChange,
  resource,
  lengthType,
  initialSelection,
}) => {
  if (!resource || !resource.periods) {
    return null;
  }

  const filteredPeriods = resource.periods.filter(
    period => period.reservationLengthType === lengthType,
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
    mustEndOnStartDay: period.multidaySettings.mustEndOnStartDay,
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
      fullDay={lengthType === reservationLengthType.WHOLE_DAY}
      initialMonth={new Date(date)}
      initialSelection={initialSelection}
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
  lengthType: PropTypes.oneOf(
    Object.values([
      reservationLengthType.WHOLE_DAY,
      reservationLengthType.OVERNIGHT,
    ]),
  ).isRequired,
  initialSelection: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
};

export default ResourceMultidayReservationCalendar;
