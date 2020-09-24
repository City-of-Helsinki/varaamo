import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getHasOnlinePaymentSupport } from '../../../../src/domain/resource/utils';
import { deleteReservation } from '../../../actions/reservationActions';
import { closeReservationCancelModal } from '../../../actions/uiActions';
import injectT from '../../../i18n/injectT';
import reservationCancelModalSelector from './reservationCancelModalSelector';
import ReservationCancelModal from '../../../../src/domain/reservation/modal/ReservationCancelModal';
import ReservationCancelNotAllowed from '../../../../src/domain/reservation/modal/ReservationCancelNotAllowed';
import client from '../../../../src/common/api/client';
import { getCancelCategories } from '../../../../src/domain/reservation/modal/utils';

class UnconnectedReservationCancelModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      cancelCategories: [],
    };
  }


  componentDidMount() {
    this.loadCancelReasonCategories();
  }

  loadCancelReasonCategories = () => {
    const { isAdmin, locale } = this.props;

    client.get('cancel_reason_category').then((res) => {
      const cancelCategories = getCancelCategories(res.data, isAdmin, locale);
      this.setState({ cancelCategories });
    });
  }

  handleCancel(res, status, bool, cancelReason) {
    const { actions, reservation } = this.props;
    actions.deleteReservation(reservation, cancelReason);

    actions.closeReservationCancelModal();
  }

  render() {
    const {
      actions,
      cancelAllowed,
      reservation,
      resource,
      show,
    } = this.props;

    const {
      cancelCategories,
    } = this.state;

    if (!show) return null;

    if (!cancelAllowed) {
      return (
        <ReservationCancelNotAllowed
          billable={getHasOnlinePaymentSupport(resource)}
          parentToggle={actions.closeReservationCancelModal}
          resource={resource}
          toggleShow={show}
        />
      );
    }

    return (
      <ReservationCancelModal
        billable={getHasOnlinePaymentSupport(resource)}
        cancelCategories={cancelCategories}
        onEditReservation={this.handleCancel}
        parentToggle={actions.closeReservationCancelModal}
        reservation={reservation}
        toggleShow={show}
      />
    );
  }
}

UnconnectedReservationCancelModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  cancelAllowed: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
};

UnconnectedReservationCancelModalContainer = injectT(UnconnectedReservationCancelModalContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCancelModal,
    deleteReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationCancelModalContainer };
export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModalContainer,
);
