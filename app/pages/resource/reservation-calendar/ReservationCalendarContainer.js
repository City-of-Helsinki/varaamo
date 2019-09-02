import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';

import { addNotification } from '../../../actions/notificationsActions';
import {
  cancelReservationEdit,
  openConfirmReservationModal,
  selectReservationSlot,
} from '../../../actions/uiActions';
import ReservationCancelModal from '../../../shared/modals/reservation-cancel/ReservationCancelModalContainer';
import ReservationInfoModal from '../../../shared/modals/reservation-info/ReservationInfoModalContainer';
import ReservationSuccessModal from '../../../shared/modals/reservation-success/ReservationSuccessModalContainer';
import ReservationConfirmation from '../../../shared/reservation-confirmation/ReservationConfirmationContainer';
import recurringReservations from '../../../state/recurringReservations';
import injectT from '../../../i18n/injectT';
import reservationCalendarSelector from './reservationCalendarSelector';
import { getReservationPrice, getEditReservationUrl, combine } from '../../../utils/reservationUtils';

export class UnconnectedReservationCalendarContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
  };

  state= {
    reservationPrice: null,
  }

  static getDerivedStateFromProps(props) {
    const { resource, selected } = props;
    let reservationPrice;

    if (selected && resource && selected.length === 2) {
      reservationPrice = getReservationPrice(selected[0].begin, selected[1].end, resource.products);
    }
    return { reservationPrice };
  }

  getSelectedTimeText = (selected) => {
    const { reservationPrice } = this.state;
    const { t } = this.props;

    if (!selected.length) {
      return '';
    }
    const orderedSelected = orderBy(selected, 'begin');
    const beginSlot = first(orderedSelected);
    const endSlot = last(orderedSelected);
    const beginText = this.getDateTimeText(beginSlot.begin, true);
    const endText = this.getDateTimeText(endSlot.end, false);
    const duration = moment.duration(moment(endSlot.end).diff(moment(beginSlot.begin)));
    const durationText = this.getDurationText(duration);
    return t('ReservationCalendar.selectedTime.infoText', {
      beginText, endText, durationText, price: reservationPrice
    });
  };

  getDurationText = (duration) => {
    const hours = duration.hours();
    const mins = duration.minutes();
    return `${hours > 0 ? `${hours}h ` : ''}${mins}min`;
  }

  handleEditCancel = () => {
    this.props.actions.cancelReservationEdit();
  };

  handleReserveClick = () => {
    const {
      actions, selected, history
    } = this.props;
    const orderedSelected = orderBy(selected, 'begin');
    const { end } = last(orderedSelected);
    const reservation = Object.assign({}, first(orderedSelected), { end });
    const nextUrl = getEditReservationUrl(reservation);

    const baseTime = combine(selected)[0];

    actions.changeRecurringBaseTime(baseTime);
    history.push(nextUrl);
  };

  render() {
    const {
      params,
      selected,
    } = this.props;

    return (
      <div className="reservation-calendar">
        <ReservationCancelModal />
        <ReservationInfoModal />
        <ReservationSuccessModal />
        <ReservationConfirmation
          params={params}
          selectedReservations={selected}
          showTimeControls
        />
      </div>
    );
  }
}

UnconnectedReservationCalendarContainer = injectT(UnconnectedReservationCalendarContainer); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    cancelReservationEdit,
    changeRecurringBaseTime: recurringReservations.changeBaseTime,
    openConfirmReservationModal,
    selectReservationSlot,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(
  reservationCalendarSelector,
  mapDispatchToProps
)(UnconnectedReservationCalendarContainer);
