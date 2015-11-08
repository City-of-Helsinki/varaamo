import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import ImagePanel from 'components/common/ImagePanel';
import Image from 'fixtures/Image';

describe('Component: common/ImagePanel', () => {
  describe('with images', () => {
    const images = [
      Image.build(),
      Image.build({ caption: null }),
    ];
    const props = {
      altText: 'some alt text',
      images: Immutable(images),
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<ImagePanel {...props} />);
    });

    it('should render a Panel component', () => {
      const panelTrees = tree.everySubTree('Panel');

      expect(panelTrees.length).to.equal(1);
    });

    it('should pass correct props to Panel component', () => {
      const actualProps = tree.subTree('Panel').props;

      expect(actualProps.collapsible).to.equal(true);
      expect(actualProps.defaultExpanded).to.equal(false);
      expect(actualProps.header).to.equal('Kuvat');
    });

    describe('rendering images', () => {
      it('should render an img element for each image', () => {
        const imgTrees = tree.everySubTree('img');
        expect(imgTrees.length).to.equal(images.length);
      });

      it('should pass correct props to img element', () => {
        const actualProps = tree.everySubTree('img')[0].props;
        const image = images[0];

        expect(actualProps.alt).to.equal(image.caption.fi);
        expect(actualProps.src).to.equal(image.url);
      });

      it('should use the prop altText for images without caption', () => {
        const imageWithoutCaptionTree = tree.everySubTree('img')[1];

        expect(imageWithoutCaptionTree.props.alt).to.equal(props.altText);
      });
    });
  });

  describe('without images', () => {
    const props = {
      altText: 'some alt text',
      images: [],
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<ImagePanel {...props} />);
    });

    it('should render nothing', () => {
      expect(tree.text()).to.equal('');
    });
  });
});
