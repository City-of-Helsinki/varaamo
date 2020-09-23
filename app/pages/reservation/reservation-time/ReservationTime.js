import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { decamelizeKeys } from 'humps';
import get from 'lodash/get';
import filter from 'lodash/filter';

import injectT from '../../../i18n/injectT';
import ResourceCalendar from '../../../shared/resource-calendar/ResourceCalendar';
import TimePickerCalendar from '../../../../src/common/calendar/TimePickerCalendar';
import { reservationLengthType } from '../../../../src/domain/resource/constants';
// eslint-disable-next-line max-len
import ResourceMultidayReservationCalendar from '../../../../src/domain/resource/resourceMultidayReservationCalendar/ResourceMultidayReservationCalendar';

class ReservationTime extends Component {
  static propTypes = {
    handleSelectReservation: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    selectedReservation: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
    addNotification: PropTypes.func.isRequired,
    isStaff: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
  };

  handleDateChange = (newDate) => {
    const { resource, history } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    history.replace(`/reservation?date=${day}&resource=${resource.id}`);
  };

  render() {
    const {
      handleSelectReservation,
      onCancel,
      onConfirm,
      resource,
      selectedReservation,
      t,
      unit,
      isStaff,
      addNotification,
      date,
    } = this.props;

    const shownDate = moment(selectedReservation.begin).isSame(date, 'day')
      ? moment(selectedReservation.begin).format('YYYY-MM-DD')
      : moment(date).format('YYYY-MM-DD');
    const decamelizedResource = decamelizeKeys(resource);
    const reservations = get(decamelizedResource, 'reservations', []);
    const filteredReservations = filter(
      reservations,
      res => selectedReservation && res.id !== selectedReservation.id,
    );
    const resourceToEdit = {
      ...decamelizedResource,
      reservations: filteredReservations,
    };

    return (
      <div className="app-ReservationTime">
        <Row>
          <Col md={7} sm={12}>
            {selectedReservation.lengthType
            === reservationLengthType.WITHIN_DAY ? (
              <>
                <ResourceCalendar
                  onDateChange={this.handleDateChange}
                  resourceId={resource.id}
                  selectedDate={shownDate}
                />
                <TimePickerCalendar
                  addNotification={addNotification}
                  date={shownDate}
                  edittingReservation={selectedReservation}
                  isStaff={isStaff}
                  onDateChange={newDate => this.handleDateChange(moment(newDate).toDate())
                  }
                  onTimeChange={selected => handleSelectReservation({
                    selected,
                    resource: resourceToEdit,
                  })
                  }
                  resource={resourceToEdit}
                />
              </>
              ) : (
                <ResourceMultidayReservationCalendar
                  date={shownDate}
                  initialSelection={{
                    from: new Date(selectedReservation.begin),
                    to: new Date(selectedReservation.end),
                  }}
                  lengthType={reservationLengthType.OVERNIGHT}
                  onDateChange={newDate => this.handleDateChange(moment(newDate).toDate())
                }
                  onSelectedRangeChange={range => handleSelectReservation({
                    selected: { start: moment(range.from), end: moment(range.to) },
                    resource: resourceToEdit,
                  })
                }
                  resource={{ ...resource, reservations: filteredReservations }}
                />
              )}
          </Col>
          <Col md={5} sm={12}>
            <Well className="app-ReservationDetails">
              <h3>{t('ReservationPage.detailsTitle')}</h3>
              <Row>
                <Col className="app-ReservationDetails__label" md={4}>
                  {t('common.resourceLabel')}
                </Col>
                <Col className="app-ReservationDetails__value" md={8}>
                  {resource.name}
                  <br />
                  {unit.name}
                </Col>
              </Row>
            </Well>
          </Col>
        </Row>
        <div className="app-ReservationTime__controls">
          <Button bsStyle="warning" onClick={onCancel}>
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
