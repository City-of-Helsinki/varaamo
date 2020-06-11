import React from 'react';

import PageWrapper from '../../PageWrapper';
import { shallowWithIntl } from '../../../utils/testUtils';
import { UnconnectedUserReservationsPage as UserReservationsPage } from '../UserReservationsPage';
import ReservationList from '../reservation-list/ReservationListContainer';

describe('pages/user-reservations/UserReservationsPage', () => {
  const defaultProps = {
    location: {
      search: '',
    },
    history: {
      push: () => {},
    },
    t: (path) => path,
    reduxReservations: {},
  };

  function getWrapper(extraProps = {}) {
    const props = { ...defaultProps, ...extraProps };
    return shallowWithIntl(<UserReservationsPage {...props} />);
  }

  describe('render', () => {
    test('renders PageWrapper with correct title', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('UserReservationsPage.title');
    });

    describe('normal render', () => {
      const wrapper = getWrapper();

      test('displays correct title inside h1 tags', () => {
        const h1 = wrapper.find('h1');
        expect(h1.text()).toBe('UserReservationsPage.title');
      });

      test('renders ReservationList with all user reservations', () => {
        const reservationList = wrapper.find(ReservationList);

        expect(reservationList.length).toBe(1);
        expect(reservationList.props().filter).toBeFalsy();
      });
    });
  });

  describe('componentDidMount', () => {
    test('fetches expected data', () => {
      const wrapperInstance = getWrapper().instance();
      const loadModelMock = jest.spyOn(wrapperInstance, 'loadModel');

      wrapperInstance.componentDidMount();

      expect(loadModelMock).toHaveBeenCalledTimes(1);
      expect(loadModelMock).toHaveBeenCalledWith(
        'reservation',
        {
          date: undefined,
          include: 'resource_detail',
          is_own: true,
          ordering: 'begin',
          page_size: 10,
        },
        expect.any(Function),
        'upcomingReservation'
      );
    });
  });

  describe('tabs', () => {
    const findTabs = (wrapper) => wrapper.find('[role="tab"]');
    const findUpcomingTab = (wrapper) => findTabs(wrapper).at(0);
    const findPastTab = (wrapper) => findTabs(wrapper).at(1);

    test('should render upcoming and past tabs', () => {
      expect(findTabs(getWrapper()).length).toEqual(2);
    });

    test('should render upcoming tab with count when loading is done', () => {
      const count = 2;
      const wrapper = getWrapper();

      wrapper.setState({
        upcomingReservation: {
          loading: false,
          count,
        },
      });

      expect(findUpcomingTab(wrapper).prop('children')).toContain(`(${count})`);
    });

    test('should render upcoming tab as active by default', () => {
      expect(findUpcomingTab(getWrapper()).prop('aria-selected')).toEqual(true);
    });

    test('should change tab on tab click if it is not current tab', () => {
      const wrapper = getWrapper();
      const pastTab = findPastTab(wrapper); // unselected by default
      const wrapperInstance = wrapper.instance();
      const setStateSpy = jest.spyOn(wrapperInstance, 'setState');

      pastTab.prop('onClick')();

      expect(setStateSpy).toHaveBeenCalledWith({ tab: 'past' });
    });

    test('should not do anything on tab click if it is current tab', () => {
      const wrapper = getWrapper();
      const upcomingTab = findUpcomingTab(wrapper); // selected by default
      const wrapperInstance = wrapper.instance();
      const setStateSpy = jest.spyOn(wrapperInstance, 'setState');

      upcomingTab.prop('onClick')();

      expect(setStateSpy).not.toHaveBeenCalled();
    });

    test('should render tabs with proper aria attributes', () => {
      const wrapper = getWrapper();
      const tabs = findTabs(wrapper);

      tabs.forEach((tab) => {
        expect(tab.prop('role')).toEqual('tab');
      });
      expect(
        tabs
          .map((tab) => tab.prop('aria-selected'))
          .some((ariaSelected) => ariaSelected)
      ).toEqual(true);
    });
  });
});
