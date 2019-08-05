import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'react-bootstrap';

import injectT from '../../../../../app/i18n/injectT';

const getDateAndTime = (reservation) => {
  const begin = moment(reservation.begin);
  const end = moment(reservation.end);

  return `${begin.format('ddd d.M.Y HH:mm')} - ${end.format('HH:mm')}`;
};

const ManageReservationsList = ({
  t,
  reservations = [],
}) => {
  return (
    <div className="app-ManageReservationsList">
      <Table className="app-ManageReservationsList__table">
        <thead>
          <tr>
            <th>{t('ManageReservationsList.nameHeader')}</th>
            <th>{t('ManageReservationsList.emailHeader')}</th>
            <th>{t('ManageReservationsList.resourceHeader')}</th>
            <th>{t('ManageReservationsList.locationHeader')}</th>
            <th>{t('ManageReservationsList.dateAndTimeHeader')}</th>
            <th />
            <th>{t('ManageReservationsList.statusHeader')}</th>
            <th>{t('ManageReservationsList.pinHeader')}</th>
            <th>{t('ManageReservationsList.actionsHeader')}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            return (
              <tr key={`reservation-${reservation.id}`}>
                <td>{reservation.user.display_name}</td>
                <td>{reservation.user.email}</td>
                <td>{reservation.resource}</td>
                <td></td>
                <td>{getDateAndTime(reservation)}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

ManageReservationsList.propTypes = {
  t: PropTypes.func.isRequired,
  reservations: PropTypes.array,
};

export default injectT(ManageReservationsList);
