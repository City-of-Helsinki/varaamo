import * as React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import get from 'lodash/get';
import moment from 'moment';

import * as resourceUtils from '../utils';
import injectT from '../../../../app/i18n/injectT';

function getDurationText(selected) {
  const start = moment(selected.start);
  const end = moment(selected.end);
  const duration = moment.duration(end.diff(start));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  let text = '';
  if (days) {
    text = `${days}d`;
  }

  if (hours) {
    text += `${hours}h`;
  }

  if (minutes) {
    text += `${minutes}min`;
  }

  return text;
}

function getSelectedDateText(resource, selected, t) {
  if (selected) {
    const start = moment(selected.start);
    const end = moment(selected.end);
    const price = resourceUtils.getReservationPrice(
      selected.start,
      selected.end,
      resource
    );

    const tVariables = {
      date: start.format('dd D.M.Y'),
      start: start.format('HH:mm'),
      end: end.format('HH:mm'),
      duration: getDurationText(selected),
      price,
    };

    if (price) {
      return t(
        'ResourceReservationCalendar.selectedDateValueWithPrice',
        tVariables
      );
    }

    return t('ResourceReservationCalendar.selectedDateValue', tVariables);
  }

  return '';
}

const ResourceReservationCalendar = ({
  isLoggedIn,
  resource,
  t,
  selected,
  onReserve,
}) => {
  const handleReserveButtonClick = () => {
    onReserve(selected, resource);
  };

  const handleLoginButtonClick = () => {
    const next = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/login?next=${next}`);
  };

  const canMakeReservations = get(
    resource,
    'userPermissions.canMakeReservations',
    false
  );
  const selectedDateText = getSelectedDateText(resource, selected, t);

  return !isLoggedIn ? (
    <div className="app-ResourceReservationButton__selectedInfo">
      <div className="app-ResourceReservationButton__loginInfo">
        {t('ReservationInfo.loginText')}
      </div>
      <Button
        bsStyle="primary"
        className="app-ResourceReservationButton__loginButton"
        onClick={handleLoginButtonClick}
      >
        {t('Navbar.login')}
      </Button>
    </div>
  ) : (
    selected.start !== null && selected.end !== null && (
      <div className="app-ResourceReservationButton__selectedInfo">
        <div className="app-ResourceReservationButton__selectedDate">
          <strong className="app-ResourceReservationButton__selectedDateLabel">
            {t('ResourceReservationCalendar.selectedDateLabel')}
          </strong>{' '}
          <span className="app-ResourceReservationButton__selectedDateValue">
            {selectedDateText}
          </span>
        </div>
        <Button
          bsStyle="primary"
          className="app-ResourceReservationButton__reserveButton"
          disabled={!canMakeReservations}
          onClick={handleReserveButtonClick}
        >
          {t('ResourceReservationCalendar.reserveButton')}
        </Button>
      </div>
    )
  );
};

ResourceReservationCalendar.propTypes = {
  isLoggedIn: PropTypes.bool,
  onReserve: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  selected: PropTypes.object,
};

export default injectT(ResourceReservationCalendar);
