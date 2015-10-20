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
  const images = [{ url: 'some-url', caption: 'some caption' }];
  const resource = Resource.build({
    images,
    unit: Unit.id,
  });
  const props = {
    actions: { fetchResource: simple.stub() },
    id: resource.id,
    isFetchingResource: false,
    resource: Immutable(resource),
    unit: Immutable(unit),
  };
  const tree = sd.shallowRender(<ResourcePage {...props} />);

  describe('rendering a link to reservation page', () => {
    const linkTree = tree.subTree('LinkContainer');

    it('should display a link to this resources reservation page', () => {
      const linkVdom = linkTree.getRenderOutput();
      const expected = `/resources/${props.resource.id}/reservation`;

      expect(linkVdom.props.to).to.equal(expected);
    });

    it('should display the link as a Button', () => {
      const buttonTrees = linkTree.everySubTree('Button');

      expect(buttonTrees.length).to.equal(1);
    });

    it('the link button should have text "Varaa tila"', () => {
      const buttonVdom = linkTree.subTree('Button').getRenderOutput();

      expect(buttonVdom.props.children).to.equal('Varaa tila');
    });
  });

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

  describe('rendering ImagePanel', () => {
    const imagePanelTrees = tree.everySubTree('ImagePanel');

    it('should render ImagePanel component', () => {
      expect(imagePanelTrees.length).to.equal(1);
    });

    it('should pass correct props to ImagePanel component', () => {
      const imagePanelVdom = imagePanelTrees[0].getRenderOutput();
      const actualProps = imagePanelVdom.props;
      const expectedAltText = `Kuva ${resource.name.fi} tilasta`;

      expect(actualProps.altText).to.equal(expectedAltText);
      expect(actualProps.images).to.deep.equal(resource.images);
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
