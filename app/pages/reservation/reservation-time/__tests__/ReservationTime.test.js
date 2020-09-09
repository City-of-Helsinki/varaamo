import React from 'react';
import simple from 'simple-mock';
import moment from 'moment';

import { shallowWithIntl } from '../../../../utils/testUtils';
import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import ReservationTime from '../ReservationTime';
import ResourceReservation from '../../../resource/resource-reservation/ResourceReservation';

describe('pages/reservation/reservation-time/ReservationTime', () => {
  const history = {
    replace: () => { },
  };

  const defaultProps = {
    handleSelectReservation: jest.fn(),
    history,
    location: {},
    addNotification: jest.fn(),
    isStaff: false,
    onCancel: simple.mock(),
    onConfirm: simple.mock(),
    resource: Resource.build(),
    selectedReservation: Reservation.build(),
    unit: Unit.build(),
    date: '',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationTime {...defaultProps} {...extraProps} />);
  }

  test('renders ResourceReservation', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const resourceReservation = wrapper.find(ResourceReservation);
    const date = moment(defaultProps.selectedReservation.begin).isSame(defaultProps.date, 'day')
      ? moment(defaultProps.selectedReservation.begin).format('YYYY-MM-DD')
      : moment(defaultProps.date).format('YYYY-MM-DD');

    expect(resourceReservation).toHaveLength(1);
    expect(resourceReservation.prop('handleDateChange')).toBe(instance.handleDateChange);
    expect(resourceReservation.prop('date')).toBe(date);
  });

  test('renders resource and unit names', () => {
    const details = getWrapper().find('.app-ReservationDetails__value');

    expect(details).toHaveLength(1);
    expect(details.props().children).toEqual(expect.arrayContaining([defaultProps.resource.name]));
    expect(details.props().children).toEqual(expect.arrayContaining([defaultProps.unit.name]));
  });

  describe('handleDateChange', () => {
    const date = new Date();
    const day = date.toISOString().substring(0, 10);
    const expectedPath = `/reservation?date=${day}&resource=${defaultProps.resource.id}`;
    let instance;
    let historyMock;

    beforeAll(() => {
      instance = getWrapper().instance();
      historyMock = simple.mock(history, 'replace');
      instance.handleDateChange(date);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history replace with correct path', () => {
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
