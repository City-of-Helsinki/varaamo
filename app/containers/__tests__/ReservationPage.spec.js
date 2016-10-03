import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import { UnconnectedReservationPage as ReservationPage } from 'containers/ReservationPage';
import ResourceHeader from 'components/resource/ResourceHeader';
import ReservationInfo from 'components/reservation/ReservationInfo';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import FavoriteButton from 'screens/shared/favorite-button';


describe('Container: ReservationPage', () => {
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
    return shallow(<ReservationPage {...defaultProps} {...props} />);
  }
  let wrapper;
  before(() => {
    wrapper = getWrapper();
  });

  describe('rendering a link to resource page', () => {
    let linkWrapper;

    before(() => {
      linkWrapper = wrapper.find(LinkContainer);
    });

    it('should display a link to this resources page', () => {
      const expected = `/resources/${defaultProps.resource.id}?date=${defaultProps.date}`;

      expect(linkWrapper.prop('to')).to.equal(expected);
    });

    it('should display the link as a Button', () => {
      const buttonTrees = linkWrapper.find(Button);

      expect(buttonTrees.length).to.equal(1);
    });

    it('the link button should have text "Tilan tiedot"', () => {
      const buttonTree = linkWrapper.find(Button);

      expect(buttonTree.prop('children')).to.equal('Tilan tiedot');
    });
  });

  describe('rendering ResourceHeader', () => {
    let resoucerHeaderWrapper;

    before(() => {
      resoucerHeaderWrapper = wrapper.find(ResourceHeader);
    });

    it('should render ResourceHeader component', () => {
      expect(resoucerHeaderWrapper.length).to.equal(1);
    });

    it('should pass correct props to ResourceHeader component', () => {
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

    it('should render ReservationInfo component', () => {
      expect(ReservationInfoWrapper).to.be.ok;
    });

    it('should pass correct props to ReservationInfo component', () => {
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

    it('should fetch resource data when component mounts', () => {
      expect(defaultProps.actions.fetchResource.callCount).to.equal(1);
    });

    it('should fetch resource with correct arguments', () => {
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

      it('should fetch resource data with new date', () => {
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

      it('should not fetch resource data', () => {
        expect(defaultProps.actions.fetchResource.callCount).to.equal(0);
      });
    });
  });
});
