import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import moment from 'moment';
import Loader from 'react-loader';

import injectT from '../../../i18n/injectT';
import ReservationCalendar from '../../resource/reservation-calendar/ReservationCalendarContainer';
import ResourceCalendar from '../../../shared/resource-calendar/ResourceCalendar';
import ReservationPhases from '../reservation-phases/ReservationPhases';
import { RESERVATION_PHASE } from '../constants';
import { getReservationDetail } from '../utils';
import { getFiltersFromUrl, getSearchFromFilters } from '../../../../src/domain/search/utils';
import { putReservation } from '../../../actions/reservationActions';
import { cancelReservation } from '../../../../src/domain/reservation/utils';

class ReservationEdit extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    isFetching: true,
    reservation: {}
  }

  componentDidMount() {
    this.setState({ isFetching: true });
    this.fetchReservation();
  }

  fetchReservation = () => {
    const { match: { params } } = this.props;
    getReservationDetail(params.reservationId).then(({ data }) => {
      this.setState({
        reservation: data,
        isFetching: false
      });
    });
  }

  handleDateChange = (newDate) => {
    const { location, history } = this.props;
    const day = newDate.toISOString().substring(0, 10);

    const filters = getFiltersFromUrl(location);

    history.push({ search: getSearchFromFilters({ ...filters, ...{ date: day } }) });
  };

  /**
   * Edit reservation, usually change state to requested
   *
   * @memberof ReservationEdit
   */
  handleEditReservation = () => {
    const { history } = this.props;
    const { reservation } = this.state;

    putReservation(Object.assign({}, this.state.reservation, { resource: reservation.resource.id, state: 'requested' }))
      .then(() => history.replace(`/reservation/${reservation.id}/confirmation`));
  }

  /**
   * Cancel reservation
   *
   * @memberof ReservationEdit
   */
  handleCancelReservation = () => {
    const { history } = this.props;
    const { reservation } = this.state;

    cancelReservation()
      .then(() => history.replace(`/reservation/${reservation.id}/confirmation?isEdited=true`));
  }

  render() {
    const {
      location,
      history,
      match,
      t,
    } = this.props;
    const { reservation, isFetching } = this.state;

    const { params } = match;
    const date = moment(reservation.begin).format('YYYY-MM-DD');

    return (
      <Loader loaded={!isFetching}>
        <div className="app-ReservationEdit">
          <Row>
            <ReservationPhases phase={RESERVATION_PHASE.EDIT} />
          </Row>

          <Row>
            <Col md={7} sm={12}>
              <div className="app-ReservationEdit__calendar">
                <ResourceCalendar
                  onDateChange={this.handleDateChange}
                  resourceId={get(reservation, 'resource.id', null)}
                  selectedDate={date}
                />
                <ReservationCalendar
                  history={history}
                  location={location}
                  params={{ ...params }}
                />
              </div>
            </Col>

            <Col md={5} sm={12}>
              <div className="app-ReservationEdit__reservation-preview">
                <Well>
                  <h3>{t('ReservationPage.detailsTitle')}</h3>
                  <Row>
                    <Col className="app-ReservationEdit__reservation-preview__label" md={4}>
                      {t('common.resourceLabel')}
                    </Col>
                    <Col className="app-ReservationEdit__reservation-preview__value" md={8}>
                      {get(reservation, 'resource.name', null)}
                      <br />
                      {get(reservation, 'resource.unit.id', null)}
                    </Col>
                  </Row>
                </Well>
              </div>
            </Col>
          </Row>

          <Row>
            <div className="app-ReservationEdit__controls">
              <Button bsStyle="warning" onClick={() => this.handleCancelReservation()}>
                {t('ReservationInformationForm.cancelEdit')}
              </Button>
              <Button bsStyle="primary" onClick={() => this.handleEditReservation()}>
                {t('common.continue')}
              </Button>
            </div>
          </Row>
        </div>
      </Loader>
    );
  }
}

export default injectT(ReservationEdit);
