import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import simple from 'simple-mock';

import CommentButton from './CommentButton';

describe('shared/comment-button/CommentButton', () => {
  const defaultProps = {
    onClick: simple.mock(),
  };

  function getWrapper(props) {
    return shallow(<CommentButton {...defaultProps} {...props} />);
  }
  let wrapper;

  beforeAll(() => {
    wrapper = getWrapper();
  });

  test('is a button', () => {
    expect(wrapper.is('button')).toBe(true);
  });

  test('has comment-button class name', () => {
    expect(wrapper.prop('className')).toBe('comment-button');
  });

  test('has correct onClick prop', () => {
    expect(wrapper.prop('onClick')).toBe(defaultProps.onClick);
  });

  test('displays a comment glyphicon', () => {
    expect(wrapper.children().is(Glyphicon)).toBe(true);
    expect(wrapper.children().prop('glyph')).toBe('comment');
  });
});
