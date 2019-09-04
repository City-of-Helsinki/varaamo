import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import moment from 'moment';
import Loader from 'react-loader';
import isEmpty from 'lodash/isEmpty';

import injectT from '../../../i18n/injectT';
import ResourceCalendar from '../../../shared/resource-calendar/ResourceCalendar';
import ReservationPhases from '../reservation-phases/ReservationPhases';
import { RESERVATION_PHASE } from '../constants';
import TimePickerCalendar from '../../../../src/common/calendar/TimePickerCalendar';
import PageWrapper from '../../PageWrapper';
import { putReservation } from '../../../../src/domain/reservation/utils';

class ReservationEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    reservation: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired
  };

  state = {
    selectedTime: null,
    selectedDate: null,
  }

  handleDateChange = (newDate) => {
    this.setState({
      selectedDate: newDate
    });
  };

  /**
   * Edit reservation, usually change state to requested
   *
   * @memberof ReservationEdit
   */
  handleEditReservation = () => {
    const { history, reservation } = this.props;
    const { selectedTime } = this.state;

    putReservation(Object.assign({}, reservation, { begin: selectedTime.start, end: selectedTime.end }))
      .then(() => history.replace(`/reservation/${reservation.id}/confirmation`));

    // TODO: Error handler
  }

  handleCancelEdit = () => {
    const { history } = this.props;

    history.replace('/my-reservations');
  }

  render() {
    const {
      t, locale
    } = this.props;
    const { reservation, resource, isFetching } = this.props;
    const { selectedDate, selectedTime } = this.state;
    const date = moment(selectedDate || reservation.begin).format('YYYY-MM-DD');

    return (
      <PageWrapper title={t('ReservationEditForm.startEdit')} transparent>
        <Loader loaded={!isFetching}>
          <h3>{t('ReservationEditForm.startEdit')}</h3>

          <div className="app-ReservationEdit">
            <Row>
              <ReservationPhases phase={RESERVATION_PHASE.EDIT} />
            </Row>

            <Row>
              <Col md={7} sm={12}>
                <div className="app-ReservationEdit__calendar">
                  <ResourceCalendar
                    onDateChange={this.handleDateChange}
                    resourceId={get(resource, 'id', null)}
                    selectedDate={date}
                  />
                  <TimePickerCalendar
                    date={date}
                    onDateChange={this.handleDateChange}
                    onTimeChange={selected => this.setState({ selectedTime: selected })}
                    resource={resource}
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
                        {get(resource, `name.${locale}`, null)}
                        <br />
                        {get(resource, 'unit.id', null)}
                      </Col>
                    </Row>
                  </Well>
                </div>
              </Col>
            </Row>

            <Row>
              <div className="app-ReservationEdit__controls">
                <Button bsStyle="warning" onClick={() => this.handleCancelEdit()}>
                  {t('ReservationInformationForm.cancelEdit')}
                </Button>
                <Button bsStyle="primary" disabled={isEmpty(selectedTime)} onClick={() => this.handleEditReservation()}>
                  {t('common.continue')}
                </Button>
              </div>
            </Row>
          </div>
        </Loader>
      </PageWrapper>
    );
  }
}

export default injectT(ReservationEdit);
