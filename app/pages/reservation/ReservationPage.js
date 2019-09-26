import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import get from 'lodash/get';
import has from 'lodash/has';
import moment from 'moment';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { postReservation, putReservation } from '../../actions/reservationActions';
import { fetchResource } from '../../actions/resourceActions';
import {
  clearReservations,
  closeReservationSuccessModal,
  openResourceTermsModal,
  setSelectedTimeSlots,
} from '../../actions/uiActions';
import PageWrapper from '../PageWrapper';
import injectT from '../../i18n/injectT';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import reservationPageSelector from './reservationPageSelector';
import { hasProducts } from '../../utils/resourceUtils';
import RecurringReservationControls from '../../shared/recurring-reservation-controls/RecurringReservationControls';
import CompactReservationList from '../../shared/compact-reservation-list/CompactReservationList';
import recurringReservationsConnector from '../../state/recurringReservations';

class UnconnectedReservationPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);
    const { reservationToEdit } = this.props;
    this.state = {
      view: !isEmpty(reservationToEdit) ? 'time' : 'information',
    };
  }

  componentDidMount() {
    const {
      location,
      reservationCreated,
      reservationEdited,
      reservationToEdit,
      selected,
      history,
    } = this.props;
    if (
      isEmpty(reservationCreated)
      && isEmpty(reservationEdited)
      && isEmpty(reservationToEdit)
      && isEmpty(selected)
    ) {
      const query = queryString.parse(location.search);

      if (!query.id && query.resource) {
        history.replace(`/resources/${query.resource}`);
      } else {
        history.replace('/my-reservations');
      }
    } else {
      this.fetchResource();
      window.scrollTo(0, 0);
    }
  }

  componentWillUpdate(nextProps) {
    const { reservationCreated: nextCreated, reservationEdited: nextEdited } = nextProps;
    const { reservationCreated, reservationEdited } = this.props;
    if (
      (!isEmpty(nextCreated) || !isEmpty(nextEdited))
      && (nextCreated !== reservationCreated || nextEdited !== reservationEdited)
    ) {
      // Reservation created for resource with product/order: proceed to payment!
      if (has(nextCreated, 'order.paymentUrl')) {
        const paymentUrl = get(nextCreated, 'order.paymentUrl');
        window.location = paymentUrl;
        return;
      }
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({ view: 'confirmation' });
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
    this.props.actions.closeReservationSuccessModal();
  }

  handleBack = () => {
    if (!isEmpty(this.props.reservationToEdit)) {
      this.setState({ view: 'time' });
      window.scrollTo(0, 0);
    }
  };

  handleCancel = () => {
    const { reservationToEdit, resource, history } = this.props;
    if (!isEmpty(reservationToEdit)) {
      history.replace('/my-reservations');
    } else {
      history.replace(`/resources/${resource.id}`);
    }
  };

  handleConfirmTime = () => {
    this.setState({ view: 'information' });
    window.scrollTo(0, 0);
  };

  createPaymentReturnUrl = () => {
    const { protocol, hostname } = window.location;
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${protocol}//${hostname}${port}/reservation-payment-return`;
  };

  handleReservation = (values = {}) => {
    const {
      actions, reservationToEdit, resource, selected, recurringReservations = []
    } = this.props;

    if (!isEmpty(selected)) {
      const { begin } = first(selected);
      const { end } = last(selected);

      if (!isEmpty(reservationToEdit)) {
        const reservation = Object.assign({}, reservationToEdit);
        actions.putReservation({
          ...reservation,
          ...values,
          begin,
          end,
        });
      } else {
        const allReservations = [...recurringReservations, { begin, end }];

        const isOrder = hasProducts(resource);
        const order = isOrder
          ? {
            order: {
              order_lines: [{
                product: get(resource, 'products[0].id'),
              }],
              return_url: this.createPaymentReturnUrl(),
            }
          } : {};

        if (isOrder) {
          this.setState({ view: 'payment' });
        }
        allReservations.forEach(reservation => actions.postReservation({
          ...values,
          ...order,
          begin: reservation.begin,
          end: reservation.end,
          resource: resource.id,
        }));
      }
    }
  };

  fetchResource() {
    const {
      actions, date, resource, location
    } = this.props;

    const start = moment(date)
      .subtract(2, 'M')
      .startOf('month')
      .format();
    const end = moment(date)
      .add(2, 'M')
      .endOf('month')
      .format();

    const params = queryString.parse(location.search);

    if (!isEmpty(resource)) {
      actions.fetchResource(resource.id, { start, end });
    } else if (params.resource) {
      actions.fetchResource(params.resource, { start, end });
      // Fetch resource by id if there are resource id exist in query but not in redux.
      // TODO: Always invoke actually API call for fetching resource by ID, will fix later.
    }
  }

  renderRecurringReservations = () => {
    const {
      resource,
      actions,
      recurringReservations,
      selectedReservations,
      t,
    } = this.props;

    const reservationsCount = selectedReservations.length + recurringReservations.length;
    const introText = resource.needManualConfirmation
      ? t('ConfirmReservationModal.preliminaryReservationText', { reservationsCount })
      : t('ConfirmReservationModal.regularReservationText', { reservationsCount });

    return (
      <>
        {/* Recurring selection dropdown  */}
        <RecurringReservationControls />
        {<p><strong>{introText}</strong></p>}

        {/* Selected recurring info */}
        <CompactReservationList
          onRemoveClick={actions.removeReservation}
          removableReservations={recurringReservations}
          reservations={selectedReservations}
        />
      </>
    );
  }

  render() {
    const {
      actions,
      isAdmin,
      isStaff,
      isFetchingResource,
      isMakingReservations,
      reservationCreated,
      reservationEdited,
      reservationToEdit,
      resource,
      selected,
      t,
      unit,
      user,
      history,
      failedReservations,
    } = this.props;
    const { view } = this.state;

    if (
      isEmpty(resource)
      && isEmpty(reservationCreated)
      && isEmpty(reservationEdited)
      && isEmpty(reservationToEdit)
      && !isFetchingResource
    ) {
      return <div />;
    }

    const isEditing = !isEmpty(reservationToEdit);
    const isEdited = !isEmpty(reservationEdited);
    const begin = !isEmpty(selected) ? first(selected).begin : null;
    const end = !isEmpty(selected) ? last(selected).end : null;
    const selectedTime = begin && end ? { begin, end } : null;
    const title = t(
      `ReservationPage.${isEditing || isEdited ? 'editReservationTitle' : 'newReservationTitle'}`
    );

    return (
      <div className="app-ReservationPage">
        <PageWrapper title={title} transparent>
          <div>
            <div className="app-ReservationPage__content">
              <h1 className="app-ReservationPage__title app-ReservationPage__title--big">
                {title}
              </h1>
              <Loader loaded={!isEmpty(resource)}>
                <ReservationPhases
                  currentPhase={view}
                  isEditing={isEditing || isEdited}
                  resource={resource}
                />
                {view === 'time' && isEditing && (
                  <ReservationTime
                    handleSelectReservation={actions.setSelectedTimeSlots}
                    history={history}
                    isStaff={isStaff}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirmTime}
                    resource={resource}
                    selectedReservation={reservationToEdit}
                    unit={unit}
                  />
                )}
                {view === 'information' && selectedTime && (
                  <>
                    {isAdmin && this.renderRecurringReservations()}
                    <ReservationInformation
                      isAdmin={isAdmin}
                      isEditing={isEditing}
                      isMakingReservations={isMakingReservations}
                      isStaff={isStaff}
                      onBack={this.handleBack}
                      onCancel={this.handleCancel}
                      onConfirm={this.handleReservation}
                      openResourceTermsModal={actions.openResourceTermsModal}
                      reservation={reservationToEdit}
                      resource={resource}
                      selectedTime={selectedTime}
                      unit={unit}
                    />
                  </>
                )}
                {view === 'payment' && (
                  <div className="text-center">
                    <p>{t('ReservationPage.paymentText')}</p>
                  </div>
                )}
                {view === 'confirmation' && (reservationCreated || reservationEdited) && (
                  <ReservationConfirmation
                    failedReservations={failedReservations}
                    isEdited={isEdited}
                    reservation={reservationCreated || reservationEdited}
                    resource={resource}
                    user={user}
                  />
                )}
              </Loader>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  reservationToEdit: PropTypes.object,
  reservationCreated: PropTypes.object,
  reservationEdited: PropTypes.object,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  failedReservations: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  recurringReservations: PropTypes.array.isRequired,
  selectedReservations: PropTypes.array.isRequired
};
UnconnectedReservationPage = injectT(UnconnectedReservationPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearReservations,
    closeReservationSuccessModal,
    fetchResource,
    openResourceTermsModal,
    putReservation,
    postReservation,
    removeReservation: recurringReservationsConnector.removeReservation,
    setSelectedTimeSlots,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationPage };
export default connect(
  reservationPageSelector,
  mapDispatchToProps
)(UnconnectedReservationPage);
