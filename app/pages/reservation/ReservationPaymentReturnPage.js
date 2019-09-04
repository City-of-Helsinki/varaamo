import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import get from 'lodash/get';
// TODO: remove use of humps when refactoring
import { camelizeKeys as camelizeKeysDeep } from 'humps';
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

const loadReservation = id => apiClient.get(`reservation/${id}`).then(({ data }) => camelizeKeysDeep(data));
const loadResource = id => apiClient.get(`resource/${id}`).then(({ data }) => camelizeKeysDeep(data));

class ReservationPaymentReturnPage extends Component {
  state = {
    isLoading: true,
    reservation: null,
    resource: null,
  };

  componentDidMount() {
    const status = this.getQueryParam('payment_status');
    const isSuccess = status === 'success';
    if (isSuccess) {
      this.loadData();
    } else {
      this.setState({ isLoading: false });
    }
  }

  loadData = () => {
    const reservationId = this.getQueryParam('reservation_id');
    const reservationPromise = loadReservation(reservationId);
    const resourcePromise = reservationPromise.then(r => loadResource(r.resource));
    Promise.all([reservationPromise, resourcePromise])
      .then(([reservation, resource]) => {
        this.setState({
          reservation,
          resource,
          isLoading: false,
        });
      })
      .catch(() => this.setState({ isLoading: false }));
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
              {status === 'success' && (
                <PaymentSuccess reservation={reservation} resource={resource} />
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
