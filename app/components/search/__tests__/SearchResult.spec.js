import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import SearchResult from 'components/search/SearchResult';
import Image from 'fixtures/Image';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: search/SearchResult', () => {
  describe('rendering', () => {
    const props = {
      date: '2015-10-10',
      result: Immutable(Resource.build({
        images: [Image.build()],
      })),
      unit: Immutable(Unit.build()),
    };
    let tree;
    let vdom;

    before(() => {
      tree = sd.shallowRender(<SearchResult {...props} />);
      vdom = tree.getRenderOutput();
    });

    it('should render a table row', () => {
      expect(vdom.type).to.equal('tr');
    });

    describe('table cells', () => {
      let tdTrees;

      before(() => {
        tdTrees = tree.everySubTree('td');
      });

      it('should render 3 table cells', () => {
        expect(tdTrees).to.have.length(3);
      });

      describe('the first table cell', () => {
        let tdTree;

        before(() => {
          tdTree = tdTrees[0];
        });

        it('should display an image with correct props', () => {
          const imageTree = tdTree.subTree('img');
          const image = props.result.images[0];

          expect(imageTree).to.be.ok;
          expect(imageTree.props.alt).to.equal(image.caption.fi);
          expect(imageTree.props.src).to.equal(`${image.url}?dim=80x80`);
        });
      });

      describe('the second table cell', () => {
        let tdTree;

        before(() => {
          tdTree = tdTrees[1];
        });

        it('should contain a link to resources page', () => {
          const linkTree = tdTree.subTree('Link');

          expect(linkTree.props.to).to.contain('resources');
        });

        it('should display the name of the result', () => {
          const expected = props.result.name.fi;

          expect(tdTree.toString()).to.contain(expected);
        });

        it('should display the name of the given unit in props', () => {
          const expected = props.unit.name.fi;

          expect(tdTree.toString()).to.contain(expected);
        });
      });

      describe('the third table cell', () => {
        let tdTree;

        before(() => {
          tdTree = tdTrees[2];
        });

        it('should have a Link to reservations page with a correct date', () => {
          const linkTree = tdTree.subTree('Link');

          expect(linkTree).to.be.ok;
          expect(linkTree.props.to).to.equal(`/resources/${props.result.id}/reservation`);
          expect(linkTree.props.query).to.deep.equal(
            { date: props.date.split('T')[0] }
          );
        });

        it('should display the available hours in a label', () => {
          const expectedText = '0 tuntia';

          expect(tdTree.subTree('Label').props.children).to.equal(expectedText);
        });
      });
    });
  });
});
