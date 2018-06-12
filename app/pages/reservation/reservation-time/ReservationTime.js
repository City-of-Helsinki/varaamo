import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { injectT } from 'i18n';
import ReservationCalendar from 'pages/resource/reservation-calendar';
import ResourceCalendar from 'shared/resource-calendar';

class ReservationTime extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    selectedReservation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
  };

  handleDateChange = (newDate) => {
    const { resource } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    browserHistory.replace(`/reservation?date=${day}&resource=${resource.id}`);
  }

  render() {
    const {
      location,
      onCancel,
      onConfirm,
      params,
      resource,
      selectedReservation,
      t,
      unit,
    } = this.props;
    const date = moment(selectedReservation.begin).format('YYYY-MM-DD');

    return (
      <div className="app-ReservationTime">
        <Row>
          <Col md={7} sm={12}>
            <ResourceCalendar
              onDateChange={this.handleDateChange}
              resourceId={resource.id}
              selectedDate={date}
            />
            <ReservationCalendar
              location={location}
              params={{ ...params, id: resource.id }}
            />
          </Col>
          <Col md={5} sm={12}>
            <Well className="app-ReservationDetails">
              <h3>{t('ReservationPage.detailsTitle')}</h3>
              <Row>
                <Col className="app-ReservationDetails__label" md={4}>
                  {t('common.resourceLabel')}
                </Col>
                <Col className="app-ReservationDetails__value" md={8}>
                  {resource.name}<br />
                  {unit.name}
                </Col>
              </Row>
            </Well>
          </Col>
        </Row>
        <div className="app-ReservationTime__controls">
          <Button
            bsStyle="warning"
            onClick={onCancel}
          >
            {t('ReservationInformationForm.cancelEdit')}
          </Button>
          <Button
            bsStyle="primary"
            disabled={isEmpty(selectedReservation)}
            onClick={onConfirm}
          >
            {t('common.continue')}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectT(ReservationTime);
