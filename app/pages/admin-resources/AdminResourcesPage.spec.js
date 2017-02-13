import { expect } from 'chai';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import AvailabilityView from 'shared/availability-view';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedAdminResourcesPage as AdminResourcesPage } from './AdminResourcesPage';

describe('pages/admin-resources/AdminResourcesPage', () => {
  const changeAdminResourcesPageDate = simple.stub();
  const fetchFavoritedResources = simple.stub();

  const defaultProps = {
    actions: {
      changeAdminResourcesPageDate,
      fetchFavoritedResources,
    },
    date: '2017-01-10',
    isAdmin: true,
    isFetchingResources: false,
    resources: [],
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<AdminResourcesPage {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('className')).to.equal('admin-resources-page');
      expect(pageWrapper.prop('title')).to.equal('AdminResourcesPage.title');
    });

    describe('when user is not admin', () => {
      let wrapper;
      before(() => {
        wrapper = getWrapper({ isAdmin: false });
      });

      it('renders a paragraph', () => {
        expect(wrapper.find('p')).to.have.length(1);
      });

      it('renders correct text in paragraph', () => {
        expect(wrapper.find('p').text()).to.equal('AdminResourcesPage.noRightsMessage');
      });
    });

    describe('when user is an admin', () => {
      function getIsAdminWrapper(props) {
        return getWrapper({ ...props, isAdmin: true });
      }

      it('displays correct title inside h1 tags', () => {
        const h1 = getIsAdminWrapper().find('h1');
        expect(h1.text()).to.equal('AdminResourcesPage.title');
      });

      it('renders a loader with a loaded prop if resources has been fetched', () => {
        const loader = getIsAdminWrapper({ isFetchingResources: false }).find(Loader);
        expect(loader.prop('loaded')).to.be.true;
      });

      it('renders a loader without loaded prop if resources has not been fetched', () => {
        const loader = getIsAdminWrapper({ isFetchingResources: true }).find(Loader);
        expect(loader.prop('loaded')).to.be.false;
      });

      it('renders AvailabilityView with correct props', () => {
        const resources = [{ foo: 'bar' }];
        const view = getIsAdminWrapper({ resources }).find(AvailabilityView);
        expect(view).to.have.length(1);
        expect(view.prop('groups')).to.deep.equal([
          { name: '', resources },
        ]);
        expect(view.prop('date')).to.deep.equal('2017-01-10');
        expect(view.prop('onDateChange')).to.equal(changeAdminResourcesPageDate);
      });
    });
  });

  describe('componentDidMount', () => {
    describe('if user is an admin', () => {
      const isAdmin = true;

      before(() => {
        fetchFavoritedResources.reset();
        getWrapper({ isAdmin }).instance().componentDidMount();
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
    });
  });

  describe('componentWillUnmount', () => {
    beforeEach(() => {
      changeAdminResourcesPageDate.reset();
    });

    it('sets date to null', () => {
      const wrapper = getWrapper();
      wrapper.instance().componentWillUnmount();
      expect(changeAdminResourcesPageDate.callCount).to.equal(1);
      expect(changeAdminResourcesPageDate.lastCall.args).to.deep.equal([null]);
    });
  });
});
