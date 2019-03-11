import { shallow } from 'enzyme';
import React from 'react';

import Label from './Label';

function getWrapper(props, content = 'Some text') {
  const defaults = {};
  return shallow(<Label {...defaults} {...props}>{content}</Label>);
}

describe('shared/label/Label', () => {
  test('renders a div.app-Label', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-Label')).toBe(true);
  });

  test('has correct shape given in the props', () => {
    const shape = 'circle';
    const wrapper = getWrapper({ shape });
    expect(wrapper.prop('className')).toContain('app-Label--shape-circle');
  });

  test('has correct size given in the props', () => {
    const size = 'small';
    const wrapper = getWrapper({ size });
    expect(wrapper.prop('className')).toContain('app-Label--size-small');
  });

  test('has correct theme given in the props', () => {
    const theme = 'gold';
    const wrapper = getWrapper({ theme });
    expect(wrapper.prop('className')).toContain('app-Label--theme-gold');
  });

  test('adds correct className given in the props', () => {
    const className = 'className';
    const wrapper = getWrapper({ className });
    expect(wrapper.prop('className')).toContain('className');
  });

  test('renders children', () => {
    const children = <span>Some text inside a span</span>;
    const wrapper = getWrapper({}, children);
    expect(wrapper.prop('children')).toBe(children);
  });
});
