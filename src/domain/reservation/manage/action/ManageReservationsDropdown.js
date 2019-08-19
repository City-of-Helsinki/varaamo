import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../../../app/i18n/injectT';
import { putReservation } from '../../../../../app/actions/reservationActions';

const ManageReservationsDropdown = ({
  t, onInfoClick, reservation,
  onEditReservation
}) => {
  return (
    <div className="app-ManageReservationDropdown">
      <DropdownButton
        id="app-ManageReservationDropdown"
        title={t('ManageReservationsList.actionsHeader')}
      >
        <MenuItem onClick={e => onInfoClick(e, reservation)}>
          {t('ManageReservationsList.actionLabel.information')}
        </MenuItem>

        {/* Only show/allow to change reservation state when its status is requested */}
        {reservation.state === 'requested' && (
        <>
          <MenuItem
            onClick={() => putReservation(reservation, { state: 'confirmed' })}
          >
            {t('ManageReservationsList.actionLabel.approve')}
          </MenuItem>
          <MenuItem
            onClick={() => putReservation(reservation, { state: 'denied' })}
          >
            {t('ManageReservationsList.actionLabel.deny')}
          </MenuItem>
        </>
        )}
        <MenuItem
          onClick={onEditReservation}
        >
          {t('ManageReservationsList.actionLabel.edit')}

        </MenuItem>
      </DropdownButton>
    </div>
  );
};

ManageReservationsDropdown.propTypes = {
  t: PropTypes.func,
  onInfoClick: PropTypes.func,
  reservation: PropTypes.object,
  onEditReservation: PropTypes.func,
};
export default injectT(ManageReservationsDropdown);
