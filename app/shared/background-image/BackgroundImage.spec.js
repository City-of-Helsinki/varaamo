import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import BackgroundImage from './BackgroundImage';

describe('shared/background-image/BackgroundImage', () => {
  const defaultProps = {
    image: { url: 'some/image.jpg' },
  };

  function getWrapper(extraProps) {
    return shallow(
      <BackgroundImage {...defaultProps} {...extraProps} />
    );
  }

  it('renders div with correct className', () => {
    const div = getWrapper().find('div');
    expect(div.prop('className')).to.equal('image-container');
  });

  it('renders children if given', () => {
    const child = <div className="child" />;
    const wrapper = shallow(<BackgroundImage {...defaultProps}>{child}</BackgroundImage>);
    expect(wrapper.children().equals(child)).to.be.true;
  });

  describe('background image styles', () => {
    it('has no styles if image does not have url', () => {
      const div = getWrapper({ image: {} }).find('.image-container');
      expect(div.prop('style')).to.deep.equal({});
    });

    it('has correct backgroundImage style if only url and no dimensions are given', () => {
      const div = getWrapper().find('.image-container');
      const expected = 'url(some/image.jpg)';
      expect(div.prop('style').backgroundImage).to.equal(expected);
    });

    it('has correct backgroundImage style if url and dimensions are given', () => {
      const div = getWrapper({ height: 400, width: 600 }).find('.image-container');
      const expected = 'url(some/image.jpg?dim=600x400)';
      expect(div.prop('style').backgroundImage).to.equal(expected);
    });
  });
});
