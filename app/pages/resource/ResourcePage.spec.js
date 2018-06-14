import { expect } from 'chai';
import React from 'react';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import NotFoundPage from 'pages/not-found/NotFoundPage';
import PageWrapper from 'pages/PageWrapper';
import ResourceCalendar from 'shared/resource-calendar';
import ResourceMap from 'shared/resource-map';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedResourcePage as ResourcePage } from './ResourcePage';
import ResourceHeader from './resource-header';
import ResourceInfo from './resource-info';
import ResourceMapInfo from './resource-map-info';

describe('pages/resource/ResourcePage', () => {
  const unit = Unit.build();
  const resource = Resource.build({
    images: [
      {
        caption: 'caption 1',
        url: 'url 1',
        type: 'main',
      },
      {
        caption: 'caption 2',
        url: 'url 2',
        type: 'other',
      },
      {
        caption: 'caption 3',
        url: 'url 3',
        type: 'other',
      },
    ],
    unit: Unit.id,
  });
  const defaultProps = {
    actions: {
      clearReservations: () => null,
      fetchResource: () => null,
      toggleResourceMap: () => null,
    },
    date: '2015-10-10',
    id: resource.id,
    isFetchingResource: false,
    isLoggedIn: true,
    location: { query: {} },
    params: {},
    resource: Immutable(resource),
    showMap: false,
    unit: Immutable(unit),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourcePage {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('title')).to.equal(defaultProps.resource.name);
      expect(pageWrapper.prop('transparent')).to.be.true;
    });

    it('renders ResourceHeader with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const resourceInfo = wrapper.find(ResourceHeader);
      expect(resourceInfo).to.have.length(1);
      expect(resourceInfo.prop('onBackClick')).to.equal(instance.handleBackButton);
      expect(resourceInfo.prop('onMapClick')).to.deep.equal(defaultProps.actions.toggleResourceMap);
      expect(resourceInfo.prop('resource')).to.deep.equal(defaultProps.resource);
      expect(resourceInfo.prop('showMap')).to.deep.equal(defaultProps.showMap);
      expect(resourceInfo.prop('unit')).to.deep.equal(defaultProps.unit);
    });

    it('renders ResourceInfo with correct props', () => {
      const resourceInfo = getWrapper().find(ResourceInfo);
      expect(resourceInfo).to.have.length(1);
      expect(resourceInfo.prop('resource')).to.deep.equal(defaultProps.resource);
      expect(resourceInfo.prop('unit')).to.deep.equal(defaultProps.unit);
    });

    it('renders ResourceCalendar with correct props', () => {
      const wrapper = getWrapper();
      const calendar = wrapper.find(ResourceCalendar);
      expect(calendar).to.have.length(1);
      expect(calendar.prop('onDateChange')).to.equal(wrapper.instance().handleDateChange);
      expect(calendar.prop('resourceId')).to.equal(defaultProps.resource.id);
      expect(calendar.prop('selectedDate')).to.equal(defaultProps.date);
    });

    it('renders resource images', () => {
      const images = getWrapper().find('.app-ResourceInfo__image');

      expect(images).to.have.length(defaultProps.resource.images.length);
      images.forEach((image, index) => {
        const imageProps = defaultProps.resource.images[index];
        expect(image.props().alt).to.equal(imageProps.caption);
        expect(image.props().src).to.equal(imageProps.url);
      });
    });

    it('renders NotFoundPage when resource empty and not fetching resource', () => {
      const notFoundPage = getWrapper({
        isFetchingResource: false,
        resource: {},
      }).find(NotFoundPage);
      expect(notFoundPage).to.have.length(1);
    });

    describe('handleBackButton', () => {
      let browserHistoryMock;

      before(() => {
        const instance = getWrapper().instance();
        browserHistoryMock = simple.mock(browserHistory, 'goBack');
        instance.handleBackButton();
      });

      after(() => {
        simple.restore();
      });

      it('calls browserHistory goBack', () => {
        expect(browserHistoryMock.callCount).to.equal(1);
      });
    });

    describe('with showMap prop', () => {
      function getShowMapWrapper(props = {}) {
        return getWrapper({ ...props, showMap: true });
      }

      it('renders a ResourceMapInfo', () => {
        const wrapper = getShowMapWrapper();
        const resourceMapInfo = wrapper.find(ResourceMapInfo);
        expect(resourceMapInfo).to.have.length(1);
        expect(resourceMapInfo.prop('unit')).to.equal(defaultProps.unit);
      });

      it('renders a ResourceMap', () => {
        const wrapper = getShowMapWrapper();
        const resourceMap = wrapper.find(ResourceMap);
        expect(resourceMap).to.have.length(1);
        expect(resourceMap.prop('location')).to.equal(defaultProps.location);
        expect(resourceMap.prop('resourceIds')).to.deep.equal([defaultProps.resource.id]);
        expect(resourceMap.prop('selectedUnitId')).to.equal(defaultProps.unit.id);
        expect(resourceMap.prop('showMap')).to.be.true;
      });

      it('does not render a ResourceInfo', () => {
        const wrapper = getShowMapWrapper();
        const resourceInfo = wrapper.find(ResourceInfo);
        expect(resourceInfo).to.have.length(0);
      });

      it('does not render a ResourceCalendar', () => {
        const wrapper = getShowMapWrapper();
        const resourceCalendar = wrapper.find(ResourceCalendar);
        expect(resourceCalendar).to.have.length(0);
      });
    });
  });

  describe('componentDidMount', () => {
    it('calls clearReservations and fetchResource', () => {
      const clearReservations = simple.mock();
      const fetchResource = simple.mock();
      const instance = getWrapper({ actions: { clearReservations } }).instance();
      instance.fetchResource = fetchResource;
      instance.componentDidMount();

      expect(clearReservations.callCount).to.equal(1);
      expect(clearReservations.lastCall.args).to.deep.equal([]);
      expect(fetchResource.callCount).to.equal(1);
      expect(fetchResource.lastCall.args).to.deep.equal([]);
    });
  });

  describe('componentWillUpdate', () => {
    describe('if date changed', () => {
      const nextProps = { date: '2016-12-12', isLoggedIn: defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper().instance();
        instance.fetchResource = fetchResource;
        instance.componentWillUpdate(nextProps);
      });

      it('fetches resource data with new date', () => {
        const actualArgs = fetchResource.lastCall.args;

        expect(fetchResource.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(nextProps.date);
      });
    });

    describe('if date did not change', () => {
      const nextProps = { date: defaultProps.date, isLoggedIn: defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper().instance();
        instance.fetchResource = fetchResource;
        instance.componentWillUpdate(nextProps);
      });

      it('does not fetch resource data', () => {
        expect(fetchResource.callCount).to.equal(0);
      });
    });

    describe('if isLoggedIn changed', () => {
      const nextProps = { date: defaultProps.date, isLoggedIn: !defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper().instance();
        instance.fetchResource = fetchResource;
        instance.componentWillUpdate(nextProps);
      });

      it('fetches resource data correct date', () => {
        const actualArgs = fetchResource.lastCall.args;

        expect(fetchResource.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(nextProps.date);
      });
    });

    describe('if isLoggedIn did not change', () => {
      const nextProps = { date: defaultProps.date, isLoggedIn: defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper({ actions: { fetchResource } }).instance();
        instance.componentWillUpdate(nextProps);
      });

      it('does not fetch resource data', () => {
        expect(fetchResource.callCount).to.equal(0);
      });
    });
  });

  describe('fetchResource', () => {
    it('fetches resource with correct arguments', () => {
      const fetchResource = simple.mock();
      const instance = getWrapper({ actions: { fetchResource } }).instance();
      instance.fetchResource();
      const actualArgs = fetchResource.lastCall.args;

      expect(fetchResource.callCount).to.equal(1);
      expect(actualArgs[0]).to.equal(defaultProps.id);
      expect(actualArgs[1].start).to.contain('2015-08-01');
      expect(actualArgs[1].end).to.contain('2015-12-31');
    });

    it('fetches resource with correct arguments with a passed date', () => {
      const fetchResource = simple.mock();
      const instance = getWrapper({ actions: { fetchResource } }).instance();
      instance.fetchResource('2015-11-11');
      const actualArgs = fetchResource.lastCall.args;

      expect(fetchResource.callCount).to.equal(1);
      expect(actualArgs[0]).to.equal(defaultProps.id);
      expect(actualArgs[1].start).to.contain('2015-09-01');
      expect(actualArgs[1].end).to.contain('2016-01-31');
    });
  });

  describe('handleDateChange', () => {
    const newDate = new Date('2015-12-24');
    const instance = getWrapper().instance();
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'replace');
      instance.handleDateChange(newDate);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.replace with correct path', () => {
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = getResourcePageUrl(resource, '2015-12-24');

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });
});
