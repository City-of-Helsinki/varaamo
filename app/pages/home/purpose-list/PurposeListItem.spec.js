import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';

import PurposeListItem from './PurposeListItem';

describe('pages/home/purpose-list/PurposeListItem', () => {
  const defaultProps = {
    imageUrl: 'some-image.jpg',
    linkUrl: 'some/url',
    text: 'Example purpose',
  };

  function getWrapper(extraProps) {
    return shallow(<PurposeListItem {...defaultProps} {...extraProps} />);
  }

  describe('Link component', () => {
    it('is rendered', () => {
      const link = getWrapper().find(Link);
      expect(link.length).to.equal(1);
    });

    it('gets correct props', () => {
      const linkProps = getWrapper().find(Link).props();
      expect(linkProps.to).to.equal(defaultProps.linkUrl);
    });
  });

  describe('image', () => {
    it('is rendered', () => {
      const image = getWrapper().find('img');
      expect(image.length).to.equal(1);
    });

    it('gets correct props', () => {
      const imageProps = getWrapper().find('img').props();
      expect(imageProps.alt).to.equal(defaultProps.text);
      expect(imageProps.src).to.equal(defaultProps.imageUrl);
    });
  });

  it('renders text given in props', () => {
    const p = getWrapper().find('p');
    expect(p.text()).to.equal(defaultProps.text);
  });
});
