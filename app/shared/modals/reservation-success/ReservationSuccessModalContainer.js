import { connect } from 'react-redux';

import { closeReservationSuccessModal } from 'actions/uiActions';
import ReservationSuccessModal from './ReservationSuccessModal';
import selector from './reservationSuccessModalSelector';

const actions = {
  closeReservationSuccessModal,
};

export default connect(selector, actions)(ReservationSuccessModal);
