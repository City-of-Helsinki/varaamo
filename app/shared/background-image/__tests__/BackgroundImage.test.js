import { shallow } from 'enzyme';
import React from 'react';

import BackgroundImage from '../BackgroundImage';

describe('shared/background-image/BackgroundImage', () => {
  const defaultProps = {
    image: { url: 'some/image.jpg' },
  };

  function getWrapper(extraProps) {
    return shallow(
      <BackgroundImage {...defaultProps} {...extraProps} />
    );
  }

  test('renders div with correct className', () => {
    const div = getWrapper().find('div');
    expect(div.prop('className')).toBe('image-container');
  });

  test('renders children if given', () => {
    const child = <div className="child" />;
    const wrapper = shallow(<BackgroundImage {...defaultProps}>{child}</BackgroundImage>);
    expect(wrapper.children().equals(child)).toBe(true);
  });

  describe('background image styles', () => {
    test('has no styles if image does not have url', () => {
      const div = getWrapper({ image: {} }).find('.image-container');
      expect(div.prop('style')).toEqual({});
    });

    test(
      'has correct backgroundImage style if only url and no dimensions are given',
      () => {
        const div = getWrapper().find('.image-container');
        const expected = 'url(some/image.jpg)';
        expect(div.prop('style').backgroundImage).toBe(expected);
      }
    );

    test(
      'has correct backgroundImage style if url and dimensions are given',
      () => {
        const div = getWrapper({ height: 400, width: 600 }).find('.image-container');
        const expected = 'url(some/image.jpg?dim=600x400)';
        expect(div.prop('style').backgroundImage).toBe(expected);
      }
    );
  });
});
