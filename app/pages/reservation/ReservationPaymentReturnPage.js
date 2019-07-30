/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import get from 'lodash/get';
import Loader from 'react-loader';

import CheckedProgressSteps from '../../shared/progress-steps/CheckedProgressSteps';
import injectT from '../../i18n/injectT';
import PageWrapper from '../PageWrapper';
import apiClient from '../../../src/common/api/client';
import PaymentFailed from './PaymentFailed';
import PaymentSuccess from './PaymentSuccess';


const stepIds = [
  'ReservationPhase.informationTitle',
  'ReservationPhase.paymentTitle',
  'ReservationPhase.confirmationTitle',
];

class ReservationPaymentReturnPage extends Component {
  state = {
    isLoading: true,
    reservation: null,
    resource: null,
    unit: null,
  };

  componentDidMount() {
    const status = this.getQueryParam('payment_status');
    const isSuccess = status === 'success';
    if (isSuccess) {
      this.loadDataToState()
        .then(() => this.setState({ isLoading: false }))
        .catch(() => this.setState({ isLoading: false }));
    } else {
      this.setState({ isLoading: false });
    }
  }

  loadDataToState = () => {
    const reservationId = this.getQueryParam('reservation_id');
    const reservationUrl = `reservation/${reservationId}`;
    return apiClient.get(reservationUrl)
      .then((response) => {
        const reservation = response.data;
        this.setState({ reservation });
        return reservation;
      })
      .then((reservation) => {
        const resourceUrl = `resource/${reservation.resource}`;
        return apiClient.get(resourceUrl);
      })
      .then((response) => {
        const resource = response.data;
        this.setState({ resource });
        return resource;
      })
      .then((resource) => {
        const unitUrl = `unit/${resource.unit.id}`;
        return apiClient.get(unitUrl);
      })
      .then((response) => {
        const unit = response.data;
        this.setState({ unit });
      });
  };

  getQueryParam = (paramName) => {
    const { location } = this.props;
    const params = queryString.parse(location.search);
    const param = get(params, paramName);
    return param;
  };

  render() {
    const { t } = this.props;
    const {
      reservation,
      resource,
      unit,
      isLoading,
    } = this.state;
    const status = this.getQueryParam('payment_status');
    const title = t('ReservationPage.newReservationTitle');
    const steps = stepIds.map(msgId => t(msgId));
    const completedSteps = status === 'success' ? steps : [t('ReservationPhase.informationTitle')];

    return (
      <PageWrapper title={title} transparent>
        <div>
          <div className="app-ReservationPage__content">
            <h1 className="app-ReservationPage__title app-ReservationPage__title--big">
              {title}
            </h1>
            <CheckedProgressSteps
              className="app-ReservationFailedPage__progress-steps"
              completedSteps={completedSteps}
              steps={steps}
            />
            <Loader loaded={!isLoading}>
              {reservation && resource && (
                <PaymentSuccess reservation={reservation} resource={resource} unit={unit} />
              )}
              {status === 'failure' && <PaymentFailed />}
            </Loader>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

ReservationPaymentReturnPage.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
};

export default injectT(ReservationPaymentReturnPage);
