import moment from 'moment';
import React, { PropTypes } from 'react';

function ReservingRestrictedText({ reservableBefore, reservableDaysInAdvance }) {
  const dateFormat = 'D.M.YYYY';
  const today = moment().format(dateFormat);
  const until = moment(reservableBefore).format(dateFormat);

  return (
    <p className="info-text">
      Voit varata tilan aikaisintaan {reservableDaysInAdvance} päivää etukäteen.
      Tällä hetkellä voit tehdä varauksen ajalle {today} {'\u2013'} {until}.
    </p>
  );
}

ReservingRestrictedText.propTypes = {
  reservableBefore: PropTypes.string.isRequired,
  reservableDaysInAdvance: PropTypes.number.isRequired,
};

export default ReservingRestrictedText;
