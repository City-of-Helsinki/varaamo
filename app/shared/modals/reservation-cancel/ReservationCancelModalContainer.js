import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toggle from 'react-toggle';

import { getHasOnlinePaymentSupport } from '../../../../src/domain/resource/utils';
import { deleteReservation } from '../../../actions/reservationActions';
import { closeReservationCancelModal } from '../../../actions/uiActions';
import injectT from '../../../i18n/injectT';
import reservationCancelModalSelector from './reservationCancelModalSelector';
import ReservationCancelModal from '../../../../src/domain/reservation/modal/ReservationCancelModal';
import client from '../../../../src/common/api/client';

class UnconnectedReservationCancelModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.state = {
      cancelCategories: [],
      checkboxDisabled: null,
    };
  }


  componentDidMount() {
    this.loadCancelReasonCategories();
  }

  loadCancelReasonCategories = () => {
    client.get('cancel_reason_category').then((res) => {
      this.setState({
        cancelCategories: res.data && res.data.map(category => ({
          value: category.id,
          label: category.name[this.props.locale || 'fi'],
        })),
      });
    });
  }

  handleCancel(res, status, bool, cancelReason) {
    const { actions, reservation } = this.props;
    actions.deleteReservation(reservation, cancelReason);

    actions.closeReservationCancelModal();
  }

  handleCheckbox() {
    this.setState(prevState => ({ checkboxDisabled: !prevState.checkboxDisabled }));
  }

  renderCheckBox(notice, onConfirm) {
    return (
      <div>
        <p><strong>{notice}</strong></p>
        <Toggle
          defaultChecked={false}
          id="checkbox"
          onChange={e => onConfirm(e.target.checked)}
        />
      </div>
    );
  }

  render() {
    const {
      actions,
      reservation,
      resource,
      show,
    } = this.props;

    const {
      cancelCategories,
    } = this.state;

    if (!show) return null;

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
  isCancellingReservations: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
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
