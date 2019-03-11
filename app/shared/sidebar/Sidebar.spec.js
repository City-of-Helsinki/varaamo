import { shallow } from 'enzyme';
import React from 'react';
import ReactSidebar from 'react-sidebar';

import Sidebar from './Sidebar';

const sidebarContent = <div>Sidebar Content</div>;

const defaultProps = {
  sidebar: sidebarContent,
  open: false,
};

function getWrapper(props, content = 'Some text') {
  return shallow(<Sidebar {...defaultProps} {...props}>{content}</Sidebar>);
}

function getSidebar(props) {
  return getWrapper(props).find(ReactSidebar);
}

describe('shared/sidebar/Sidebar', () => {
  test('renders a div.app-Sidebar', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-Sidebar')).toBe(true);
  });

  test('renders a react Sidebar', () => {
    const sidebar = getSidebar();
    expect(sidebar.is(ReactSidebar)).toBe(true);
  });

  test('has correct props', () => {
    const sidebar = getSidebar();
    expect(sidebar.prop('contentClassName')).toBe('app-Sidebar__content');
    expect(sidebar.prop('docked')).toBe(false);
    expect(typeof sidebar.prop('onSetOpen')).toBe('function');
    expect(sidebar.prop('open')).toBe(false);
    expect(sidebar.prop('pullRight')).toBe(true);
    expect(sidebar.prop('sidebar')).toEqual(sidebarContent);
    expect(sidebar.prop('touch')).toBe(false);
    expect(sidebar.children().text()).toBe('Some text');
  });

  test('passes onSetOpen from props to sidebar', () => {
    const onSetOpen = () => {};
    const sidebar = getSidebar({ onSetOpen });
    expect(sidebar.prop('onSetOpen')).toBe(onSetOpen);
  });

  test('passes correct props on open', () => {
    const sidebar = getSidebar({ open: true });
    expect(sidebar.prop('open')).toBe(true);
    expect(sidebar.prop('docked')).toBe(false);
  });

  test('passes correct props on open and docked', () => {
    const sidebar = getSidebar({ open: true, docked: true });
    expect(sidebar.prop('open')).toBe(true);
    expect(sidebar.prop('docked')).toBe(true);
  });

  test('passes correct props on not open and docked', () => {
    const sidebar = getSidebar({ open: false, docked: true });
    expect(sidebar.prop('open')).toBe(false);
    expect(sidebar.prop('docked')).toBe(false);
  });
});
