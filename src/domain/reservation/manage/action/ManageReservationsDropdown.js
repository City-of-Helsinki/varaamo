import React, { useState } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../../../app/i18n/injectT';
import ManageReservationsInfoModal from '../information/ManageReservationsInfoModal';


const ManageReservationsDropdown = ({
  t, reservation
}) => {
  const [isOpen, toggleModal] = useState(false);
  return (
    <div className="app-ManageReservationDropdown">
      <DropdownButton
        id="app-ManageReservationDropdown"
        title={t('ManageReservationsList.actionsHeader')}
      >
        <MenuItem onClick={() => toggleModal(true)}>{t('ManageReservationsList.actionLabel.information')}</MenuItem>
        <MenuItem>{t('ManageReservationsList.actionLabel.approve')}</MenuItem>
        <MenuItem>{t('ManageReservationsList.actionLabel.deny')}</MenuItem>
        <MenuItem>{t('ManageReservationsList.actionLabel.edit')}</MenuItem>
      </DropdownButton>

      {isOpen && <ManageReservationsInfoModal isOpen={isOpen} onHide={toggleModal} reservation={reservation} />}
    </div>
  );
};

ManageReservationsDropdown.propTypes = {
  t: PropTypes.func,
  reservation: PropTypes.object
};
export default injectT(ManageReservationsDropdown);
