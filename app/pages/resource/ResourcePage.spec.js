import { expect } from 'chai';
import React from 'react';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import DateHeader from 'shared/date-header';
import ResourceCalendar from 'shared/resource-calendar';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedResourcePage as ResourcePage } from './ResourcePage';
import ReservationInfo from './reservation-info';
import ResourceInfo from './resource-info';

describe('pages/resource/ResourcePage', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const defaultProps = {
    actions: { fetchResource: () => null },
    date: '2015-10-10',
    id: resource.id,
    isAdmin: false,
    isFetchingResource: false,
    isLoggedIn: true,
    location: { query: {} },
    params: {},
    resource: Immutable(resource),
    unit: Immutable(unit),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourcePage {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('className')).to.equal('app-ResourcePage');
      expect(pageWrapper.prop('title')).to.equal(defaultProps.resource.name);
    });

    it('renders ResourceInfo with correct props', () => {
      const resourceInfo = getWrapper().find(ResourceInfo);
      expect(resourceInfo).to.have.length(1);
      expect(resourceInfo.prop('resource')).to.deep.equal(defaultProps.resource);
      expect(resourceInfo.prop('unit')).to.deep.equal(defaultProps.unit);
    });

    it('renders ReservationInfo with correct props', () => {
      const reservationInfo = getWrapper().find(ReservationInfo);
      expect(reservationInfo).to.have.length(1);
      expect(reservationInfo.prop('isLoggedIn')).to.equal(defaultProps.isLoggedIn);
      expect(reservationInfo.prop('resource')).to.deep.equal(defaultProps.resource);
    });

    it('renders ResourceCalendar with correct props', () => {
      const wrapper = getWrapper();
      const calendar = wrapper.find(ResourceCalendar);
      expect(calendar).to.have.length(1);
      expect(calendar.prop('onDateChange')).to.equal(wrapper.instance().handleDateChange);
      expect(calendar.prop('resourceId')).to.equal(defaultProps.resource.id);
      expect(calendar.prop('selectedDate')).to.equal(defaultProps.date);
    });

    it('renders DateHeader with correct props', () => {
      const wrapper = getWrapper();
      const dateHeader = wrapper.find(DateHeader);
      expect(dateHeader).to.have.length(1);
      expect(dateHeader.prop('date')).to.equal(defaultProps.date);
      expect(dateHeader.prop('onDecreaseDateButtonClick')).to.equal(wrapper.instance().decreaseDate);
      expect(dateHeader.prop('onIncreaseDateButtonClick')).to.equal(wrapper.instance().increaseDate);
      expect(dateHeader.prop('scrollTo')).to.exist;
    });
  });

  describe('componentDidMount', () => {
    it('calls fetchResource', () => {
      const fetchResource = simple.mock();
      const instance = getWrapper().instance();
      instance.fetchResource = fetchResource;
      instance.componentDidMount();

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
