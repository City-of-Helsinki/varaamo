import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import { UnconnectedReservationPage as ReservationPage } from 'containers/ReservationPage';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Container: ReservationPage', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const props = {
    actions: { fetchResource: simple.stub() },
    date: '2015-10-10',
    id: resource.id,
    isFetchingResource: false,
    isLoggedIn: true,
    location: { query: {} },
    params: {},
    resource: Immutable(resource),
    unit: Immutable(unit),
  };
  const tree = sd.shallowRender(<ReservationPage {...props} />);

  describe('rendering a link to resource page', () => {
    const linkTree = tree.subTree('LinkContainer');

    it('should display a link to this resources page', () => {
      const expected = `/resources/${props.resource.id}?date=${props.date}`;

      expect(linkTree.props.to).to.equal(expected);
    });

    it('should display the link as a Button', () => {
      const buttonTrees = linkTree.everySubTree('Button');

      expect(buttonTrees.length).to.equal(1);
    });

    it('the link button should have text "Tilan tiedot"', () => {
      const buttonTree = linkTree.subTree('Button');

      expect(buttonTree.props.children).to.equal('Tilan tiedot');
    });
  });

  describe('rendering ResourceHeader', () => {
    const resourceHeaderTrees = tree.everySubTree('ResourceHeader');

    it('should render ResourceHeader component', () => {
      expect(resourceHeaderTrees.length).to.equal(1);
    });

    it('should pass correct props to ResourceHeader component', () => {
      const actualProps = resourceHeaderTrees[0].props;

      expect(actualProps.name).to.equal(props.resource.name.fi);
      expect(typeof actualProps.address).to.equal('string');
    });
  });

  describe('rendering ReservationInfo', () => {
    it('should render ReservationInfo component', () => {
      expect(tree.subTree('ReservationInfo')).to.be.ok;
    });

    it('should pass correct props to ReservationInfo component', () => {
      const actualProps = tree.subTree('ReservationInfo').props;

      expect(actualProps.isLoggedIn).to.equal(props.isLoggedIn);
      expect(actualProps.resource).to.equal(props.resource);
    });
  });

  describe('componentDidMount', () => {
    before(() => {
      props.actions.fetchResource.reset();
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch resource data when component mounts', () => {
      expect(props.actions.fetchResource.callCount).to.equal(1);
    });

    it('should fetch resource with correct arguments', () => {
      const actualArgs = props.actions.fetchResource.lastCall.args;

      expect(actualArgs[0]).to.equal(props.id);
      expect(actualArgs[1].start).to.contain(props.date);
      expect(actualArgs[1].end).to.contain(props.date);
    });
  });

  describe('componentWillUpdate', () => {
    describe('if date changed', () => {
      let nextProps;

      before(() => {
        props.actions.fetchResource.reset();
        const instance = tree.getMountedInstance();
        nextProps = { date: '2016-12-12' };
        instance.componentWillUpdate(nextProps);
      });

      it('should fetch resource data with new date', () => {
        const actualArgs = props.actions.fetchResource.lastCall.args;

        expect(props.actions.fetchResource.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(props.id);
        expect(actualArgs[1].start).to.contain(nextProps.date);
        expect(actualArgs[1].end).to.contain(nextProps.date);
      });
    });

    describe('if date did not change', () => {
      let nextProps;

      before(() => {
        props.actions.fetchResource.reset();
        const instance = tree.getMountedInstance();
        nextProps = { date: props.date };
        instance.componentWillUpdate(nextProps);
      });

      it('should not fetch resource data', () => {
        expect(props.actions.fetchResource.callCount).to.equal(0);
      });
    });
  });
});
