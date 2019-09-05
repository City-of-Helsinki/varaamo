import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../../../app/i18n/injectT';
import { RESERVATION_STATE } from '../../../../constants/ReservationState';

const UntranslatedManageReservationsDropdown = ({
  t, onInfoClick, reservation,
  onEditClick,
  onEditReservation
}) => {
  return (
    <div className="app-ManageReservationDropdown">
      <DropdownButton
        id="app-ManageReservationDropdown"
        title={t('ManageReservationsList.actionsHeader')}
      >
        <MenuItem onClick={onInfoClick}>
          {t('ManageReservationsList.actionLabel.information')}
        </MenuItem>

        {/* Only show/allow to change reservation state when its status is requested */}
        {reservation.state === RESERVATION_STATE.REQUESTED && (
        <>
          <MenuItem
            onClick={() => onEditReservation(reservation, RESERVATION_STATE.CONFIRMED)}
          >
            {t('ManageReservationsList.actionLabel.approve')}
          </MenuItem>
          <MenuItem
            onClick={() => onEditReservation(reservation, RESERVATION_STATE.DENIED)}
          >
            {t('ManageReservationsList.actionLabel.deny')}
          </MenuItem>
        </>
        )}

        {reservation.state !== RESERVATION_STATE.CANCELLED
          && (
          <MenuItem
            onClick={() => onEditReservation(reservation, RESERVATION_STATE.CANCELLED)}
          >
            {t('ManageReservationsList.actionLabel.cancel')}
          </MenuItem>
          )
        }

        <MenuItem
          onClick={onEditClick}
        >
          {t('ManageReservationsList.actionLabel.edit')}

        </MenuItem>
      </DropdownButton>
    </div>
  );
};

UntranslatedManageReservationsDropdown.propTypes = {
  t: PropTypes.func,
  onInfoClick: PropTypes.func,
  reservation: PropTypes.object,
  onEditClick: PropTypes.func,
  onEditReservation: PropTypes.func
};
export { UntranslatedManageReservationsDropdown };

export default injectT(UntranslatedManageReservationsDropdown);
