import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RESERVATION_PHASE } from '../constants';
import { getReservationPageLink, getReservationById } from '../utils';
import { formatTime } from '../../../common/time/utils';
import { getResourceById } from '../../resource/utils';
import PageWrapper from '../../../../app/pages/PageWrapper';
import ReservationPhases from '../../../../app/pages/reservation/reservation-phases/ReservationPhases';
import ReservationTime from '../../../../app/pages/reservation/reservation-time/ReservationTime';

class ReservationPage extends Component {
  state = {
    phase: RESERVATION_PHASE.EDIT,
  };

  componentDidMount() {
    const {
      match: { params }, history
    } = this.props;

    if (!params.reservationId) {
      history.replace('/my-reservations');
    } else {
      this.fetchReservation();
    }
  }

  /*
    Event handler
  */
  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  handleCancel = () => {
    const { history } = this.props;

    history.replace('/my-reservations');
  };

  handleConfirmTime = () => {
    this.setState({ phase: RESERVATION_PHASE.CONFIRMATION });
  };

  handleDateChange = (newDate) => {
    const { history } = this.props;
    const { reservation } = this.state;

    const day = formatTime(newDate);

    history.push({
      pathname: getReservationPageLink(reservation),
      search: { date: day }
    });
  };

  /* HTTP function */
  fetchResource = async (resourceId) => {
    const {
      date
    } = this.props;

    const start = moment(date)
      .subtract(2, 'M')
      .startOf('month')
      .format();
    const end = moment(date)
      .add(2, 'M')
      .endOf('month')
      .format();

    let response;
    try {
      response = await getResourceById(resourceId, { start, end });

      this.setState({
        resource: response.data
      });
    } catch (err) {
      // TODO: handle error
    }
  }

  fetchReservation = async () => {
    const { match: { params } } = this.props;

    let response;
    try {
      response = await getReservationById(params.reservationId);

      this.setState({
        reservation: response.data
      });

      this.fetchResource(response.data.resource);
    } catch (error) {
      // TODO: handle error
    }
  };

  render() {
    const {
      actions,
      t,
    } = this.props;
    const { phase, resource, reservation } = this.state;

    const pageTitle = `ReservationPage.${phase}`;

    if (
      isEmpty(resource)
      || isEmpty(reservation)
    ) {
      return <div />;
    }

    return (
      <div className="app-ReservationPage">
        <PageWrapper title={pageTitle} transparent>
          <div>
            <div className="app-ReservationPage__content">
              <h1 className="app-ReservationPage__title app-ReservationPage__title--big">
                {pageTitle}
              </h1>
              <Loader loaded={!isEmpty(resource)}>
                <ReservationPhases
                  currentPhase={phase}
                  resource={resource}
                />

                <div className="app-ReservationPhases">
                  {phase === RESERVATION_PHASE.EDIT && (
                    <ReservationTime
                      handleDateChange={this.handleDateChange}
                      onCancel={this.handleCancel}
                      onConfirm={this.handleConfirmTime}
                      reservation={reservation}
                      resource={resource}
                    />
                  )}

                  {phase === RESERVATION_PHASE.INFORMATION && (
                    <ReservationInformation
                      onBack={this.handleBack}
                      onCancel={this.handleCancel}
                      onConfirm={this.handleReservation}
                      openResourceTermsModal={actions.openResourceTermsModal}
                      reservation={reservation}
                      resource={resource}
                      unit={reservation.unit}
                    />
                  )}

                  {phase === RESERVATION_PHASE.PAYMENT && (
                    <div className="text-center">
                      <p>{t('ReservationPage.paymentText')}</p>
                    </div>
                  )}

                  {phase === RESERVATION_PHASE.CONFIRMATION && (
                    <ReservationConfirmation
                      resource={resource}
                    />
                  )}
                </div>
              </Loader>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }
}

ReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default injectT(ReservationPage);
