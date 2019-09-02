import MockDate from 'mockdate';
import React from 'react';
import moment from 'moment';
import simple from 'simple-mock';

import Resource from '../../../../utils/fixtures/Resource';
import { shallowWithIntl } from '../../../../utils/testUtils';
import {
  UnconnectedReservationCalendarContainer
  as ReservationCalendarContainer
} from '../ReservationCalendarContainer';

describe('pages/resource/reservation-calendar/ReservationCalendarContainer', () => {
  const actions = {
    addNotification: simple.stub(),
    cancelReservationEdit: simple.stub(),
    changeRecurringBaseTime: simple.stub(),
    clearReservations: simple.stub(),
    openConfirmReservationModal: simple.stub(),
    selectReservationSlot: simple.stub(),
  };
  const resource = Resource.build();

  const history = {
    push: () => { },
  };
  const defaultProps = {
    actions,
    history,
    date: '2015-10-11',
    isAdmin: false,
    isEditing: false,
    isFetchingResource: false,
    isLoggedIn: true,
    isStaff: false,
    location: { search: '' },
    params: { id: resource.id },
    resource,
    selected: [],
  };
  function getWrapper(props) {
    return shallowWithIntl(<ReservationCalendarContainer {...defaultProps} {...props} />);
  }

  describe('render', () => {
    const now = '2016-10-10T06:00:00+03:00';

    beforeAll(() => {
      MockDate.set(now);
    });

    afterAll(() => {
      MockDate.reset();
    });
  });

  describe('getDurationText', () => {
    const instance = getWrapper().instance();

    test(
      'returns string that contains hours and minutes when the duration over 60 minutes',
      () => {
        const duration = moment.duration({ minutes: 90 });
        const durationText = instance.getDurationText(duration);
        expect(durationText).toBe('1h 30min');
      }
    );

    test(
      'returns string that contains only minutes when the duration shorter than 60 minutes',
      () => {
        const duration = moment.duration({ minutes: 50 });
        const durationText = instance.getDurationText(duration);
        expect(durationText).toBe('50min');
      }
    );
  });

  describe('getSelectedTimeText', () => {
    let instance;
    beforeAll(() => {
      instance = getWrapper().instance();
      simple.mock(instance, 'getDateTimeText').returnWith('some text');
    });

    afterAll(() => {
      simple.restore();
    });

    test('returns empty string if selected empty', () => {
      const result = instance.getSelectedTimeText([]);

      expect(result).toBe('');
      expect(instance.getDateTimeText.callCount).toBe(0);
    });

    test('calls getDateTimeText when selected', () => {
      const selectedSlot = {
        begin: '2016-10-12T10:00:00.000Z',
        end: '2016-10-12T11:00:00.000Z',
        resource: 'some-resource',
      };
      const result = instance.getSelectedTimeText([selectedSlot]);

      expect(instance.getDateTimeText.callCount).toBe(2);
      expect(result).toBe('ReservationCalendar.selectedTime.infoText');
    });
  });

  describe('handleEditCancel', () => {
    test('calls cancelReservationEdit', () => {
      const instance = getWrapper().instance();
      instance.handleEditCancel();
      expect(actions.cancelReservationEdit.callCount).toBe(1);
    });
  });

  describe('handleReserveClick', () => {
    const selected = [
      {
        begin: '2016-10-12T10:00:00+03:00',
        end: '2016-10-12T11:00:00+03:00',
        resource: 'some-resource',
      },
    ];
    const now = '2016-10-12T08:00:00+03:00';
    let historyMock;

    beforeAll(() => {
      MockDate.set(now);
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
      MockDate.reset();
    });

    test(
      'calls actions addNotification when user has max open reservations for resource',
      () => {
        const isAdmin = false;
        const maxReservationsPerUser = 1;
        const reservations = [
          {
            end: '2016-10-12T09:00:00+03:00',
            isOwn: true,
          },
          {
            end: '2016-10-12T10:00:00+03:00',
            isOwn: false,
          },
        ];
        const resourceWithReservations = Resource.build({
          maxReservationsPerUser,
          reservations,
        });
        const instance = getWrapper({
          isAdmin,
          resource: resourceWithReservations,
          selected,
        }).instance();
        defaultProps.actions.addNotification.reset();
        instance.handleReserveClick();
        expect(defaultProps.actions.addNotification.callCount).toBe(1);
      }
    );
    test('calls history push with correct path', () => {
      const expectedPath = `/reservation?begin=10:00&date=2016-10-12&end=11:00&id=&resource=${
        selected[0].resource
      }`;
      const instance = getWrapper({ selected }).instance();
      instance.handleReserveClick();
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });

    test('change recurrring base time, to enable recurring control for reservation information', () => {
      defaultProps.actions.changeRecurringBaseTime.reset();

      const instance = getWrapper({ selected }).instance();
      instance.handleReserveClick();
      expect(defaultProps.actions.changeRecurringBaseTime.callCount).toBe(1);
    });
  });
});
