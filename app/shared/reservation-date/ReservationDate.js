import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

import iconClock from '../../assets/icons/clock-o.svg';
import { isMultiday } from '../../utils/reservationUtils';

function ReservationDate({ beginDate, endDate, className = '' }) {
  if (!beginDate || !endDate) {
    return <span />;
  }

  const reservationBegin = moment(beginDate);
  const reservationEnd = moment(endDate);

  const isMultidayReservation = isMultiday(reservationBegin, reservationEnd);

  const beginDay = reservationBegin.format('D');
  const beginDayOfWeek = reservationBegin.format('dddd');
  const beginMonth = reservationBegin.format('MMMM');

  const endDay = reservationEnd.format('D');
  const endDayOfWeek = reservationEnd.format('dddd');
  const endMonth = reservationEnd.format('MMMM');

  const beginTime = reservationBegin.format('HH:mm');
  const endTime = reservationEnd.format('HH:mm');
  const hours = reservationEnd.diff(reservationBegin, 'hours', true);

  return isMultidayReservation ? (
    <div
      className={classNames(
        className,
        'reservation-date',
        'reservation-date-multiday',
      )}
    >
      <div>
        <div className="reservation-date__content">
          <h5 className="reservation-date__month">{beginMonth}</h5>
          <h1>{beginDay}</h1>
          <h5 className="reservation-date__day-of-week">{beginDayOfWeek}</h5>
        </div>
        <h3>
          <img alt="" className="reservation-date__icon" src={iconClock} />
          {beginTime}
        </h3>
      </div>
      <span>-</span>
      <div>
        <div className="reservation-date__content">
          <h5 className="reservation-date__month">{endMonth}</h5>
          <h1>{endDay}</h1>
          <h5 className="reservation-date__day-of-week">{endDayOfWeek}</h5>
        </div>
        <h3>
          <img alt="" className="reservation-date__icon" src={iconClock} />
          {endTime}
        </h3>
      </div>
    </div>
  ) : (
    <div className={classNames(className, 'reservation-date')}>
      <div className="reservation-date__content">
        <h5 className="reservation-date__month">{beginMonth}</h5>
        <h1>{beginDay}</h1>
        <h5 className="reservation-date__day-of-week">{beginDayOfWeek}</h5>
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
