import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import { UnconnectedResourcePage as ResourcePage } from 'containers/ResourcePage';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Container: ResourcePage', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const props = {
    actions: { fetchResource: simple.stub() },
    id: resource.id,
    resource: Immutable(resource),
    unit: Immutable(unit),
  };
  const tree = sd.shallowRender(<ResourcePage {...props} />);

  describe('rendering ResourceHeader', () => {
    const resourceHeaderTrees = tree.everySubTree('ResourceHeader');

    it('should render ResourceHeader component', () => {
      expect(resourceHeaderTrees.length).to.equal(1);
    });

    it('should pass correct props to ResourceHeader component', () => {
      const resourceHeaderVdom = resourceHeaderTrees[0].getRenderOutput();
      const actualProps = resourceHeaderVdom.props;

      expect(actualProps.name).to.equal(props.resource.name.fi);
      expect(typeof actualProps.address).to.equal('string');
    });
  });

  describe('rendering ResourceDetails', () => {
    const resourceDetailsTrees = tree.everySubTree('ResourceDetails');

    it('should render ResourceDetails component', () => {
      expect(resourceDetailsTrees.length).to.equal(1);
    });

    it('should pass correct props to ResourceDetails component', () => {
      const resourceDetailsVdom = resourceDetailsTrees[0].getRenderOutput();
      const actualProps = resourceDetailsVdom.props;

      expect(typeof actualProps.capacityString).to.equal('string');
      expect(typeof actualProps.description).to.equal('string');
      expect(typeof actualProps.type).to.equal('string');
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch resource data when component mounts', () => {
      expect(props.actions.fetchResource.callCount).to.equal(1);
    });
  });
});
