import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../../../app/i18n/injectT';
import { RESERVATION_STATE } from '../../../../constants/ReservationState';

const UntranslatedManageReservationsDropdown = ({
  t, onInfoClick, reservation,
  onEditClick,
  onEditReservation,
  userCanModify,
  userCanCancel,
}) => {
  return (
    <div className="app-ManageReservationDropdown">
      {userCanModify && (
        <DropdownButton
          id="app-ManageReservationDropdown"
          title={t('ManageReservationsList.actionsHeader')}
        >
          <MenuItem onClick={onInfoClick}>
            {t('ManageReservationsList.actionLabel.information')}
          </MenuItem>

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

          <MenuItem
            onClick={onEditClick}
          >
            {t('ManageReservationsList.actionLabel.edit')}
          </MenuItem>

          {userCanCancel && (
            <MenuItem
              onClick={() => onEditReservation(reservation, RESERVATION_STATE.CANCELLED, true)}
            >
              {t('ManageReservationsList.actionLabel.cancel')}
            </MenuItem>
          )}
        </DropdownButton>
      )}
    </div>
  );
};

UntranslatedManageReservationsDropdown.propTypes = {
  t: PropTypes.func,
  onInfoClick: PropTypes.func,
  reservation: PropTypes.object,
  onEditClick: PropTypes.func,
  onEditReservation: PropTypes.func,
  userCanCancel: PropTypes.bool,
  userCanModify: PropTypes.bool,
};
export { UntranslatedManageReservationsDropdown };

export default injectT(UntranslatedManageReservationsDropdown);
