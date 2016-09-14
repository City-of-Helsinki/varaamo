import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import Image from 'fixtures/Image';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import ResourceListItem from './ResourceListItem';

describe('screens/shared/resource-list/ResourceListItem', () => {
  describe('rendering', () => {
    const props = {
      date: '2015-10-10',
      resource: Immutable(Resource.build({
        images: [Image.build()],
      })),
      unit: Immutable(Unit.build()),
    };
    let tree;
    let vdom;

    before(() => {
      tree = sd.shallowRender(<ResourceListItem {...props} />);
      vdom = tree.getRenderOutput();
    });

    it('should render an li element', () => {
      expect(vdom.type).to.equal('li');
    });

    it('should render an image with correct props', () => {
      const imageTree = tree.subTree('img');
      const image = props.resource.images[0];

      expect(imageTree).to.be.ok;
      expect(imageTree.props.alt).to.equal(image.caption.fi);
      expect(imageTree.props.src).to.equal(`${image.url}?dim=100x100`);
    });

    describe('names', () => {
      let namesTree;

      before(() => {
        namesTree = tree.subTree('.names');
      });

      it('should render a link to resources page', () => {
        const linkTree = namesTree.subTree('Link');

        expect(linkTree.props.to).to.contain('resources');
      });

      it('should render the name of the resource', () => {
        const expected = props.resource.name.fi;

        expect(namesTree.toString()).to.contain(expected);
      });

      it('should render the name of the given unit in props', () => {
        const expected = props.unit.name.fi;

        expect(namesTree.toString()).to.contain(expected);
      });
    });

    describe('available time', () => {
      let availableTimeTree;

      before(() => {
        availableTimeTree = tree.subTree('.available-time');
      });

      it('should have a Link to reservations page with a correct date', () => {
        const linkTree = availableTimeTree.subTree('Link');

        expect(linkTree).to.be.ok;
        expect(linkTree.props.to).to.equal(`/resources/${props.resource.id}/reservation`);
        expect(linkTree.props.query).to.deep.equal(
          { date: props.date.split('T')[0] }
        );
      });

      it('should display the available hours in a label', () => {
        const expectedText = '0 tuntia vapaana';

        expect(availableTimeTree.subTree('Label').props.children).to.equal(expectedText);
      });
    });
  });
});
