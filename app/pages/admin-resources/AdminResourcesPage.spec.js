import { expect } from 'chai';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import AvailabilityView from 'shared/availability-view';
import ResourceTypeFilter from 'shared/resource-type-filter';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedAdminResourcesPage as AdminResourcesPage } from './AdminResourcesPage';

describe('pages/admin-resources/AdminResourcesPage', () => {
  const changeAdminResourcesPageDate = simple.stub();
  const fetchFavoritedResources = simple.stub();
  const filterAdminResourceType = simple.stub();
  const openConfirmReservationModal = simple.stub();
  const unfilterAdminResourceType = simple.stub();

  const defaultProps = {
    actions: {
      changeAdminResourcesPageDate,
      changeRecurringBaseTime: () => null,
      fetchFavoritedResources,
      filterAdminResourceType,
      openConfirmReservationModal,
      unfilterAdminResourceType,
    },
    date: '2017-01-10',
    filteredResourceTypes: [],
    isAdmin: true,
    isLoggedin: true,
    isFetchingResources: false,
    location: { id: '123' },
    resources: [],
    resourceTypes: ['a', 'b', 'c'],
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<AdminResourcesPage {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('className')).to.equal('admin-resources-page');
      expect(pageWrapper.prop('title')).to.equal('AdminResourcesPage.adminTitle');
      expect(pageWrapper.prop('fluid')).to.be.true;
    });

    describe('when user is not admin', () => {
      let wrapper;
      before(() => {
        wrapper = getWrapper({ isAdmin: false });
      });

      it('renders a paragraph', () => {
        expect(wrapper.find('p')).to.have.length(1);
      });
    });

    describe('when user is an admin', () => {
      function getIsAdminWrapper(props) {
        return getWrapper({ ...props, isAdmin: true });
      }

      it('displays correct title inside h1 tags', () => {
        const h1 = getIsAdminWrapper().find('h1');
        expect(h1.text()).to.equal('AdminResourcesPage.adminTitle');
      });

      describe('Loader', () => {
        it('is not loaded if fetching resources and no resources in the state', () => {
          const props = { isFetchingResources: true, resources: [] };
          const loader = getIsAdminWrapper(props).find(Loader);
          expect(loader.prop('loaded')).to.be.false;
        });

        it('is loaded if not fetching resource', () => {
          const props = { isFetchingResources: false, resources: [] };
          const loader = getIsAdminWrapper(props).find(Loader);
          expect(loader.prop('loaded')).to.be.true;
        });

        it('is loaded if resources in state', () => {
          const props = { isFetchingResources: true, resources: [{ id: 'r-1' }] };
          const loader = getIsAdminWrapper(props).find(Loader);
          expect(loader.prop('loaded')).to.be.true;
        });
      });

      it('renders AvailabilityView with correct props', () => {
        const resources = [{ foo: 'bar' }];
        const wrapper = getIsAdminWrapper({ resources });
        const view = wrapper.find(AvailabilityView);
        expect(view).to.have.length(1);
        expect(view.prop('groups')).to.deep.equal([
          { name: '', resources },
        ]);
        expect(view.prop('date')).to.deep.equal('2017-01-10');
        expect(view.prop('onDateChange')).to.equal(changeAdminResourcesPageDate);
        expect(view.prop('onSelect')).to.equal(wrapper.instance().handleSelect);
      });

      it('renders ResourceTypeFilter with correct props', () => {
        const wrapper = getIsAdminWrapper();
        const resourceTypeFilter = wrapper.find(ResourceTypeFilter);
        expect(resourceTypeFilter).to.have.length(1);
        expect(resourceTypeFilter.prop('filteredResourceTypes')).to.deep.equal(
          defaultProps.filteredResourceTypes
        );
        expect(resourceTypeFilter.prop('resourceTypes')).to.deep.equal(defaultProps.resourceTypes);
        expect(resourceTypeFilter.prop('onFilterResourceType')).to.equal(filterAdminResourceType);
        expect(resourceTypeFilter.prop('onUnfilterResourceType')).to.equal(
          unfilterAdminResourceType
        );
      });
    });
  });

  describe('componentDidMount', () => {
    describe('if user is an admin', () => {
      const isAdmin = true;
      const timer = 5;
      let instance;

      before(() => {
        fetchFavoritedResources.reset();
        simple.mock(window, 'setInterval').returnWith(timer);
        instance = getWrapper({ isAdmin }).instance();
        instance.componentDidMount();
      });

      after(() => {
        simple.restore();
      });

      it('fetches favorited resources', () => {
        expect(fetchFavoritedResources.callCount).to.equal(1);
      });

      it('fetches date\'s resources', () => {
        const args = fetchFavoritedResources.lastCall.args;
        expect(args[0].format('YYYY-MM-DD')).to.equal('2017-01-10');
      });

      it('passes adminResourcesPage as source', () => {
        const args = fetchFavoritedResources.lastCall.args;
        expect(args[1]).to.equal('adminResourcesPage');
      });

      it('starts fetching resources every ten minutes', () => {
        expect(window.setInterval.callCount).to.equal(1);
        const interval = 10 * 60 * 1000;
        expect(window.setInterval.lastCall.args).to.deep.equal([instance.fetchResources, interval]);
      });

      it('saves interval to this.updateResourcesTimer', () => {
        expect(instance.updateResourcesTimer).to.equal(timer);
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let instance;

    before(() => {
      instance = getWrapper().instance();
      instance.fetchResources = simple.mock();
    });

    afterEach(() => {
      instance.fetchResources.reset();
    });

    after(() => {
      simple.restore();
    });

    it('does not call fetchResources if props have not changed', () => {
      instance.componentWillReceiveProps(defaultProps);
      expect(instance.fetchResources.callCount).to.equal(0);
    });

    it('calls fetchResources if props have changed date', () => {
      instance.componentWillReceiveProps({ ...defaultProps, date: '2017-01-12' });
      expect(instance.fetchResources.callCount).to.equal(1);
      expect(instance.fetchResources.lastCall.args).to.deep.equal(['2017-01-12']);
    });

    it('calls fetchResources if props have changed location', () => {
      instance.componentWillReceiveProps({ ...defaultProps, location: { id: '321' } });
      expect(instance.fetchResources.callCount).to.equal(1);
      expect(instance.fetchResources.lastCall.args).to.deep.equal([defaultProps.date]);
    });
  });

  describe('componentWillUnmount', () => {
    const timer = 5;
    let instance;

    before(() => {
      changeAdminResourcesPageDate.reset();
      simple.mock(window, 'setInterval').returnWith(timer);
      simple.mock(window, 'clearInterval').returnWith(timer);
      instance = getWrapper().instance();
      instance.componentDidMount();
      instance.componentWillUnmount();
    });

    after(() => {
      simple.restore();
    });

    it('sets date to null', () => {
      expect(changeAdminResourcesPageDate.callCount).to.equal(1);
      expect(changeAdminResourcesPageDate.lastCall.args).to.deep.equal([null]);
    });

    it('it clears fetchResources interval', () => {
      expect(window.clearInterval.callCount).to.equal(1);
      expect(window.clearInterval.lastCall.args).to.deep.equal([timer]);
    });
  });

  describe('handleSelect', () => {
    it('saves selection to state', () => {
      const wrapper = getWrapper();
      const selection = { some: 'data' };
      wrapper.instance().handleSelect(selection);
      expect(wrapper.state()).to.deep.equal({ selection });
    });

    it('calls changeRecurringBaseTime with correct time', () => {
      const changeRecurringBaseTime = simple.mock();
      const selection = {
        begin: '2017-04-21T12:00:00+03:00',
        end: '2017-04-21T13:00:00+03:00',
        resourceId: 'r-1',
      };
      const actions = { ...defaultProps.actions, changeRecurringBaseTime };
      const wrapper = getWrapper({ actions });
      wrapper.instance().handleSelect(selection);
      expect(changeRecurringBaseTime.callCount).to.equal(1);
      expect(changeRecurringBaseTime.lastCall.args).to.deep.equal([selection]);
    });

    it('opens the confirm reservation modal', () => {
      openConfirmReservationModal.reset();
      const wrapper = getWrapper();
      wrapper.instance().handleSelect({});
      expect(openConfirmReservationModal.callCount).to.equal(1);
    });
  });
});
