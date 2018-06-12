import { expect } from 'chai';
import React from 'react';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';
import moment from 'moment';

import ReservationCalendar from 'pages/resource/reservation-calendar';
import ResourceCalendar from 'shared/resource-calendar';
import { shallowWithIntl } from 'utils/testUtils';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import ReservationTime from './ReservationTime';

describe('pages/reservation/reservation-time/ReservationTime', () => {
  const defaultProps = {
    location: {},
    onCancel: simple.mock(),
    onConfirm: simple.mock(),
    params: {},
    resource: Resource.build(),
    selectedReservation: Reservation.build(),
    unit: Unit.build(),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationTime {...defaultProps} {...extraProps} />);
  }

  it('renders ResourceCalendar', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const resourceCalendar = wrapper.find(ResourceCalendar);
    const date = moment(defaultProps.selectedReservation.begin).format('YYYY-MM-DD');

    expect(resourceCalendar).to.have.length(1);
    expect(resourceCalendar.prop('onDateChange')).to.equal(instance.handleDateChange);
    expect(resourceCalendar.prop('selectedDate')).to.equal(date);
  });

  it('renders ReservationCalendar', () => {
    const location = { query: { q: 1 } };
    const reservationCalendar = getWrapper({ location }).find(ReservationCalendar);

    expect(reservationCalendar).to.have.length(1);
    expect(reservationCalendar.prop('location')).to.deep.equal(location);
    expect(reservationCalendar.prop('params')).to.deep.equal({ id: defaultProps.resource.id });
  });

  it('renders resource and unit names', () => {
    const details = getWrapper().find('.app-ReservationDetails__value');

    expect(details).to.have.length(1);
    expect(details.props().children).to.contain(defaultProps.resource.name);
    expect(details.props().children).to.contain(defaultProps.unit.name);
  });

  describe('handleDateChange', () => {
    const date = new Date();
    const day = date.toISOString().substring(0, 10);
    const expectedPath = `/reservation?date=${day}&resource=${defaultProps.resource.id}`;
    let instance;
    let browserHistoryMock;

    before(() => {
      instance = getWrapper().instance();
      browserHistoryMock = simple.mock(browserHistory, 'replace');
      instance.handleDateChange(date);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory replace with correct path', () => {
      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
    });
  });
});
