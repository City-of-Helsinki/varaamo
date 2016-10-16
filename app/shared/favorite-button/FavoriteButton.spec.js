import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import simple from 'simple-mock';

import FavoriteButton from './FavoriteButton';

describe('shared/favorite-button/FavoriteButton', () => {
  const defaultProps = {
    favorited: true,
    onClick: simple.mock(),
  };

  function getWrapper(props) {
    return shallow(<FavoriteButton {...defaultProps} {...props} />);
  }
  let wrapper;

  before(() => {
    wrapper = getWrapper();
  });

  it('is a button', () => {
    expect(wrapper.is('button')).to.be.true;
  });

  it('has favorite-button class name', () => {
    expect(wrapper.prop('className')).to.equal('favorite-button');
  });

  it('passes onClick prop', () => {
    expect(wrapper.prop('onClick')).to.deep.equal(defaultProps.onClick);
  });


  it('has a star glyphicon if favorited', () => {
    expect(wrapper.children().is(Glyphicon)).to.be.true;
    expect(wrapper.children().prop('glyph')).to.equal('star');
  });

  it('has a star-empty glyphicon if not favorited', () => {
    const customWrapper = getWrapper({ favorited: false });
    expect(customWrapper.children().is(Glyphicon)).to.be.true;
    expect(customWrapper.children().prop('glyph')).to.equal('star-empty');
  });
});
