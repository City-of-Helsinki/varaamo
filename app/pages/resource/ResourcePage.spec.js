import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { UnconnectedResourcePage as ResourcePage } from './ResourcePage';
import ReservationInfo from './reservation-info';
import ResourceInfo from './resource-info';

describe('pages/resource/ResourcePage', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const defaultProps = {
    actions: { fetchResource: simple.stub() },
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
    return shallow(<ResourcePage {...defaultProps} {...props} />);
  }

  let wrapper;

  before(() => {
    wrapper = getWrapper();
  });

  describe('rendering ResourceInfo', () => {
    it('renders ResourceInfo component', () => {
      const resourceInfo = getWrapper().find(ResourceInfo);

      expect(resourceInfo.length).to.equal(1);
    });

    it('passes correct props to ResourceInfo component', () => {
      const actualProps = getWrapper().find(ResourceInfo).props();

      expect(actualProps.resource).to.deep.equal(defaultProps.resource);
      expect(actualProps.unit).to.deep.equal(defaultProps.unit);
    });
  });

  describe('rendering ReservationInfo', () => {
    let ReservationInfoWrapper;

    before(() => {
      ReservationInfoWrapper = wrapper.find(ReservationInfo);
    });

    it('renders ReservationInfo component', () => {
      expect(ReservationInfoWrapper).to.be.ok;
    });

    it('passes correct props to ReservationInfo component', () => {
      const actualProps = ReservationInfoWrapper.props();

      expect(actualProps.isLoggedIn).to.equal(defaultProps.isLoggedIn);
      expect(actualProps.resource).to.equal(defaultProps.resource);
    });
  });

  describe('componentDidMount', () => {
    before(() => {
      defaultProps.actions.fetchResource.reset();
      const instance = wrapper.instance();
      instance.componentDidMount();
    });

    it('fetches resource data when component mounts', () => {
      expect(defaultProps.actions.fetchResource.callCount).to.equal(1);
    });

    it('fetches resource with correct arguments', () => {
      const actualArgs = defaultProps.actions.fetchResource.lastCall.args;

      expect(actualArgs[0]).to.equal(defaultProps.id);
      expect(actualArgs[1].start).to.contain(defaultProps.date);
      expect(actualArgs[1].end).to.contain(defaultProps.date);
    });
  });

  describe('componentWillUpdate', () => {
    describe('if date changed', () => {
      let nextProps;

      before(() => {
        defaultProps.actions.fetchResource.reset();
        const instance = wrapper.instance();
        nextProps = { date: '2016-12-12' };
        instance.componentWillUpdate(nextProps);
      });

      it('fetches resource data with new date', () => {
        const actualArgs = defaultProps.actions.fetchResource.lastCall.args;

        expect(defaultProps.actions.fetchResource.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(defaultProps.id);
        expect(actualArgs[1].start).to.contain(nextProps.date);
        expect(actualArgs[1].end).to.contain(nextProps.date);
      });
    });

    describe('if date did not change', () => {
      let nextProps;

      before(() => {
        defaultProps.actions.fetchResource.reset();
        const instance = wrapper.instance();
        nextProps = { date: defaultProps.date };
        instance.componentWillUpdate(nextProps);
      });

      it('does not fetch resource data', () => {
        expect(defaultProps.actions.fetchResource.callCount).to.equal(0);
      });
    });
  });
});
