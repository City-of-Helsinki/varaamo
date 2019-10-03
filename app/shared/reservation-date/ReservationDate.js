import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

import iconClock from '../../assets/icons/clock-o.svg';

function ReservationDate({ beginDate, endDate, className = '' }) {
  if (!beginDate || !endDate) {
    return <span />;
  }
  const reservationBegin = moment(beginDate);
  const reservationEnd = moment(endDate);
  const day = reservationBegin.format('D');
  const dayOfWeek = reservationBegin.format('dddd');
  const month = reservationBegin.format('MMMM');
  const beginTime = reservationBegin.format('HH:mm');
  const endTime = reservationEnd.format('HH:mm');
  const hours = reservationEnd.diff(reservationBegin, 'hours', true);
  const classes = classNames(
    className,
    'reservation-date',
  );
  return (
    <div className={classes}>
      <div className="reservation-date__content">
        <h5 className="reservation-date__month">{month}</h5>
        <h1>{day}</h1>
        <h5 className="reservation-date__day-of-week">{dayOfWeek}</h5>
      </div>
      <h3>
        <img alt="" className="reservation-date__icon" src={iconClock} />
        {` ${beginTime} \u2013 ${endTime} (${hours}h)`}
      </h3>
    </div>
  );
}

ReservationDate.propTypes = {
  beginDate: PropTypes.string,
  endDate: PropTypes.string,
  className: PropTypes.string,
};

export default ReservationDate;
