import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import ReservationInfo from 'components/reservation/ReservationInfo';
import ResourceHeader from 'components/resource/ResourceHeader';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import FavoriteButton from 'screens/shared/favorite-button';
import { UnconnectedResourcePage as ResourcePage } from './ResourcePage';

describe('screens/resource/ResourcePage', () => {
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

  describe('rendering ResourceHeader', () => {
    let resoucerHeaderWrapper;

    before(() => {
      resoucerHeaderWrapper = wrapper.find(ResourceHeader);
    });

    it('renders ResourceHeader component', () => {
      expect(resoucerHeaderWrapper.length).to.equal(1);
    });

    it('passes correct props to ResourceHeader component', () => {
      const actualProps = resoucerHeaderWrapper.props();

      expect(actualProps.name).to.equal(defaultProps.resource.name.fi);
      expect(typeof actualProps.address).to.equal('string');
    });
  });

  describe('rendering FavoriteButton', () => {
    let FavoriteButtonWrapper;
    let FavoriteButtonNoAdminWrapper;

    before(() => {
      FavoriteButtonNoAdminWrapper = wrapper.find(FavoriteButton);
      FavoriteButtonWrapper = getWrapper({ isAdmin: true }).find(FavoriteButton);
    });

    it('is not rendered if user is not admin', () => {
      expect(FavoriteButtonNoAdminWrapper.length).to.equal(0);
    });

    it('is rendered if user is admin', () => {
      expect(FavoriteButtonWrapper.length).to.equal(1);
    });

    it('gets resource props', () => {
      expect(FavoriteButtonWrapper.props()).to.deep.equal({ resource });
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
