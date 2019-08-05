import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import get from 'lodash/get';
import { Table } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl';

import * as dataUtils from '../../../../common/data/utils';
import injectT from '../../../../../app/i18n/injectT';

const getDateAndTime = (reservation) => {
  const begin = moment(reservation.begin);
  const end = moment(reservation.end);

  return `${begin.format('ddd d.M.Y HH:mm')} - ${end.format('HH:mm')}`;
};

const getResourceUnit = (resource, units) => {
  // TODO: Get the correct resource unit when API supports adding resource objects to reservations endpoint.
  return units[Math.round(Math.random() * units.length) - 1];
};

const ManageReservationsList = ({
  intl,
  t,
  reservations = [],
  units = [],
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
            const unit = getResourceUnit(reservation.resource, units);

            return (
              <tr key={`reservation-${reservation.id}`}>
                <td>{get(reservation, 'user.display_name', '')}</td>
                <td>{get(reservation, 'user.email', '')}</td>
                <td>{get(reservation, 'resource')}</td>
                <td>{dataUtils.getLocalizedFieldValue(unit.name, intl.locale)}</td>
                <td>{getDateAndTime(reservation)}</td>
                <td />
                <td />
                <td />
                <td />
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
  units: PropTypes.array,
  intl: intlShape,
};

export default injectT(injectIntl(ManageReservationsList));
