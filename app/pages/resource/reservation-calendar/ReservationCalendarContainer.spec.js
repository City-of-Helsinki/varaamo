import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';
import simple from 'simple-mock';

import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
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
    changeRecurringBaseTime: () => null,
    clearReservations: simple.stub(),
    openConfirmReservationModal: simple.stub(),
    toggleTimeSlot: simple.stub(),
  };
  const resource = Resource.build();

  const defaultProps = {
    actions,
    date: '2015-10-11',
    isAdmin: false,
    isEditing: false,
    isFetchingResource: false,
    isLoggedIn: true,
    isMakingReservations: false,
    isStaff: false,
    location: { query: {} },
    params: { id: resource.id },
    resource,
    selected: [],
    timeSlots: [
      TimeSlot.build(),
      TimeSlot.build(),
    ],
  };
  function getWrapper(props) {
    return shallowWithIntl(<ReservationCalendarContainer {...defaultProps} {...props} />);
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

    it('renders a header', () => {
      expect(wrapper.find('h3').text()).to.equal('ReservationCalendar.header');
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

  describe('handleEditCancel', () => {
    it('calls cancelReservationEdit', () => {
      const instance = getWrapper().instance();
      instance.handleEditCancel();
      expect(actions.cancelReservationEdit.callCount).to.equal(1);
    });
  });

  describe('handleReserveButtonClick', () => {
    function callHandleReserveButtonClick(extraActions, extraProps) {
      const wrapper = getWrapper({ actions: { ...actions, ...extraActions }, ...extraProps });
      wrapper.instance().handleReserveButtonClick();
    }

    it('calls openConfirmReservationModal', () => {
      const openConfirmReservationModal = simple.mock();
      callHandleReserveButtonClick({ openConfirmReservationModal });
      expect(openConfirmReservationModal.callCount).to.equal(1);
    });

    it('calls changeRecurringBaseTime with correct time', () => {
      const changeRecurringBaseTime = simple.mock();
      const selected = [
        '2017-04-19T07:00:00.000Z/2017-04-19T07:30:00.000Z',
        '2017-04-19T07:30:00.000Z/2017-04-19T08:00:00.000Z',
        '2017-04-19T08:00:00.000Z/2017-04-19T08:30:00.000Z',
      ];
      const expectedTime = {
        begin: '2017-04-19T07:00:00.000Z',
        end: '2017-04-19T08:30:00.000Z',
      };
      callHandleReserveButtonClick({ changeRecurringBaseTime }, { selected });
      expect(changeRecurringBaseTime.callCount).to.equal(1);
      expect(changeRecurringBaseTime.lastCall.args).to.deep.equal([expectedTime]);
    });
  });
});
