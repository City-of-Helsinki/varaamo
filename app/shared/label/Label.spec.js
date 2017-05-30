import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Label from './Label';

function getWrapper(props, content = 'Some text') {
  const defaults = {};
  return shallow(<Label {...defaults} {...props}>{content}</Label>);
}

describe('shared/label/Label', () => {
  it('renders a div.app-Label', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-Label')).to.be.true;
  });

  it('has correct shape given in the props', () => {
    const shape = 'circle';
    const wrapper = getWrapper({ shape });
    expect(wrapper.prop('className')).to.contain('app-Label--shape-circle');
  });

  it('has correct size given in the props', () => {
    const size = 'small';
    const wrapper = getWrapper({ size });
    expect(wrapper.prop('className')).to.contain('app-Label--size-small');
  });

  it('has correct theme given in the props', () => {
    const theme = 'gold';
    const wrapper = getWrapper({ theme });
    expect(wrapper.prop('className')).to.contain('app-Label--theme-gold');
  });

  it('adds correct className given in the props', () => {
    const className = 'className';
    const wrapper = getWrapper({ className });
    expect(wrapper.prop('className')).to.contain('className');
  });

  it('renders children', () => {
    const children = <span>Some text inside a span</span>;
    const wrapper = getWrapper({}, children);
    expect(wrapper.prop('children')).to.equal(children);
  });
});
