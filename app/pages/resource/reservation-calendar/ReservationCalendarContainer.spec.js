import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';
import { Calendar } from 'react-date-picker';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import DateHeader from 'shared/date-header';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedReservationCalendarContainer as ReservationCalendarContainer,
} from './ReservationCalendarContainer';
import ReservationCalendarControls from './ReservationCalendarControls';
import ReservingRestrictedText from './ReservingRestrictedText';
import TimeSlots from './time-slots';


describe('pages/resource/reservation-calendar/ReservationCalendarContainer', () => {
  const actions = {
    addNotification: simple.stub(),
    cancelReservationEdit: simple.stub(),
    clearReservations: simple.stub(),
    openConfirmReservationModal: simple.stub(),
    toggleTimeSlot: simple.stub(),
  };
  const resource = Resource.build();

  function getWrapper(props) {
    const defaults = {
      actions,
      date: '2015-10-11',
      isAdmin: false,
      isEditing: false,
      isFetchingResource: false,
      isLoggedIn: true,
      isMakingReservations: false,
      location: { hash: '&some=hash' },
      params: { id: resource.id },
      resource,
      selected: [],
      staffUnits: [],
      timeSlots: [
        TimeSlot.build(),
        TimeSlot.build(),
      ],
      urlHash: '',
    };

    return shallowWithIntl(<ReservationCalendarContainer {...defaults} {...props} />);
  }

  function makeRenderTests(props, options) {
    let wrapper;
    const {
      renderClosedText,
      renderControls,
      renderRestrictedText,
      renderTimeSlots,
    } = options;

    before(() => {
      wrapper = getWrapper(props);
    });

    it('renders Calendar', () => {
      expect(wrapper.find(Calendar).length).to.equal(1);
    });

    it('renders DateHeader', () => {
      expect(wrapper.find(DateHeader).length).to.equal(1);
    });

    it(`${renderTimeSlots ? 'renders' : 'does not render'} TimeSlots`, () => {
      expect(wrapper.find(TimeSlots).length === 1).to.equal(renderTimeSlots);
    });

    it(`${renderClosedText ? 'renders' : 'does not render'} closed text`, () => {
      expect(wrapper.find('.closed-text').length === 1).to.equal(renderClosedText);
    });

    it(`${renderRestrictedText ? 'renders' : 'does not render'} restricted text`, () => {
      expect(wrapper.find(ReservingRestrictedText).length === 1).to.equal(renderRestrictedText);
    });

    it(`${renderControls ? 'renders' : 'does not render'} ReservationCalendarControls`, () => {
      expect(wrapper.find(ReservationCalendarControls).length === 1).to.equal(renderControls);
    });

    it('renders ReservationCancelModal', () => {
      expect(wrapper.find(ReservationCancelModal).length).to.equal(1);
    });

    it('renders ReservationInfoModal', () => {
      expect(wrapper.find(ReservationInfoModal).length).to.equal(1);
    });

    it('renders ReservationSuccessModal', () => {
      expect(wrapper.find(ReservationSuccessModal).length).to.equal(1);
    });
  }

  describe('render', () => {
    const now = '2016-10-10T06:00:00+03:00';

    before(() => {
      MockDate.set(now);
    });

    after(() => {
      MockDate.reset();
    });

    describe('when date is in the past', () => {
      const date = '2015-10-10';

      describe('when resource is closed', () => {
        const timeSlots = [];
        const props = { date, timeSlots };
        const options = {
          renderClosedText: true,
          renderControls: false,
          renderRestrictedText: false,
          renderTimeSlots: false,
        };
        makeRenderTests(props, options);
      });

      describe('when resource is open', () => {
        const timeSlots = [TimeSlot.build()];
        const props = { date, timeSlots };
        const options = {
          renderClosedText: false,
          renderControls: false,
          renderRestrictedText: false,
          renderTimeSlots: true,
        };
        makeRenderTests(props, options);
      });
    });

    describe('when date is not in the past', () => {
      const date = '2016-12-12';

      describe('when resource is closed', () => {
        const timeSlots = [];
        const props = { date, timeSlots };
        const options = {
          renderClosedText: true,
          renderControls: false,
          renderRestrictedText: false,
          renderTimeSlots: false,
        };
        makeRenderTests(props, options);
      });

      describe('when resource is open', () => {
        const timeSlots = [TimeSlot.build()];

        describe('when reserving is restricted', () => {
          const restrictedResource = Resource.build({
            reservableBefore: '2016-11-11T06:00:00+03:00',
            reservableDaysInAdvance: 32,
          });
          const props = { date, resource: restrictedResource, timeSlots };
          const options = {
            renderClosedText: false,
            renderControls: false,
            renderRestrictedText: true,
            renderTimeSlots: false,
          };
          makeRenderTests(props, options);
        });

        describe('when reserving is not restricted', () => {
          const props = { date, timeSlots };
          const options = {
            renderClosedText: false,
            renderControls: true,
            renderRestrictedText: false,
            renderTimeSlots: true,
          };
          makeRenderTests(props, options);
        });
      });
    });
  });

  describe('componentWillUnmount', () => {
    it('calls clearReservations', () => {
      const instance = getWrapper().instance();
      instance.componentWillUnmount();
      expect(actions.clearReservations.callCount).to.equal(1);
    });
  });

  describe('onDateChange', () => {
    const newDate = '2015-12-24';
    const instance = getWrapper().instance();
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
      instance.onDateChange(newDate);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = getResourcePageUrl(resource, newDate);

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('handleEditCancel', () => {
    it('calls cancelReservationEdit', () => {
      const instance = getWrapper().instance();
      instance.handleEditCancel();
      expect(actions.cancelReservationEdit.callCount).to.equal(1);
    });
  });
});
