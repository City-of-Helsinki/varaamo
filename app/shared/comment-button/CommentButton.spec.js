import { expect } from 'chai';
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

  before(() => {
    wrapper = getWrapper();
  });

  it('is a button', () => {
    expect(wrapper.is('button')).to.be.true;
  });

  it('has comment-button class name', () => {
    expect(wrapper.prop('className')).to.equal('comment-button');
  });

  it('has correct onClick prop', () => {
    expect(wrapper.prop('onClick')).to.equal(defaultProps.onClick);
  });

  it('displays a comment glyphicon', () => {
    expect(wrapper.children().is(Glyphicon)).to.be.true;
    expect(wrapper.children().prop('glyph')).to.equal('comment');
  });
});
