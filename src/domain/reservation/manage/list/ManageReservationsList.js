import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import get from 'lodash/get';
import { Table } from 'react-bootstrap';
import { injectIntl, intlShape } from 'react-intl';

import * as dataUtils from '../../../../common/data/utils';
import injectT from '../../../../../app/i18n/injectT';
import ManageReservationsStatus from '../status/ManageReservationsStatus';
import ManageReservationsPincode from '../pincode/ManageReservationsPincode';
import ManageReservationsComment from '../comment/ManageReservationsComment';
import ManageReservationsDropdown from '../action/ManageReservationsDropdown';

export const getDateAndTime = (reservation) => {
  const begin = moment(reservation.begin);
  const end = moment(reservation.end);

  return `${begin.format('ddd L HH:mm')} - ${end.format('HH:mm')}`;
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
  toggleModal
}) => {
  return (
    <div className="app-ManageReservationsList">
      <Table className="app-ManageReservationsList__table">
        <thead>
          <tr>
            <th>{t('ManageReservationsList.descriptionHeader')}</th>
            <th>{t('ManageReservationsList.nameHeader')}</th>
            <th>{t('ManageReservationsList.emailHeader')}</th>
            <th>{t('ManageReservationsList.resourceHeader')}</th>
            <th>{t('ManageReservationsList.locationHeader')}</th>
            <th>{t('ManageReservationsList.dateAndTimeHeader')}</th>
            <th />
            <th>{t('ManageReservationsList.pinHeader')}</th>
            <th />
            <th>{t('ManageReservationsList.statusHeader')}</th>
            <th>{t('ManageReservationsList.actionsHeader')}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            const unit = getResourceUnit(reservation.resource, units);

            return (
              <tr key={`reservation-${reservation.id}`}>
                <td>{get(reservation, 'event_description', '')}</td>
                <td>{get(reservation, 'user.display_name', '')}</td>
                <td>{get(reservation, 'user.email', '')}</td>
                <td>{get(reservation, 'resource')}</td>
                <td>{dataUtils.getLocalizedFieldValue(get(unit, 'name'), intl.locale)}</td>
                <td>{getDateAndTime(reservation)}</td>
                <td />
                <td><ManageReservationsPincode reservation={reservation} /></td>
                <td><ManageReservationsComment comments={reservation.comments} /></td>
                <td><ManageReservationsStatus reservation={reservation} /></td>
                <td><ManageReservationsDropdown reservation={reservation} toggleModal={toggleModal} /></td>
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
  toggleModal: PropTypes.func
};

export const UnwrappedManageReservationsList = injectT(ManageReservationsList);
export default injectIntl(UnwrappedManageReservationsList);
