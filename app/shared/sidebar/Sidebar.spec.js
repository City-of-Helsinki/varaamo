import { expect } from 'chai';
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
    expect(wrapper.is('div.app-Sidebar')).to.be.true;
  });

  test('renders a react Sidebar', () => {
    const sidebar = getSidebar();
    expect(sidebar.is(ReactSidebar)).to.be.true;
  });

  test('has correct props', () => {
    const sidebar = getSidebar();
    expect(sidebar.prop('contentClassName')).to.equal('app-Sidebar__content');
    expect(sidebar.prop('docked')).to.be.false;
    expect(sidebar.prop('onSetOpen')).to.be.a('function');
    expect(sidebar.prop('open')).to.be.false;
    expect(sidebar.prop('pullRight')).to.be.true;
    expect(sidebar.prop('sidebar')).to.deep.equal(sidebarContent);
    expect(sidebar.prop('touch')).to.be.false;
    expect(sidebar.children().text()).to.equal('Some text');
  });

  test('passes onSetOpen from props to sidebar', () => {
    const onSetOpen = () => {};
    const sidebar = getSidebar({ onSetOpen });
    expect(sidebar.prop('onSetOpen')).to.equal(onSetOpen);
  });

  test('passes correct props on open', () => {
    const sidebar = getSidebar({ open: true });
    expect(sidebar.prop('open')).to.be.true;
    expect(sidebar.prop('docked')).to.be.false;
  });

  test('passes correct props on open and docked', () => {
    const sidebar = getSidebar({ open: true, docked: true });
    expect(sidebar.prop('open')).to.be.true;
    expect(sidebar.prop('docked')).to.be.true;
  });

  test('passes correct props on not open and docked', () => {
    const sidebar = getSidebar({ open: false, docked: true });
    expect(sidebar.prop('open')).to.be.false;
    expect(sidebar.prop('docked')).to.be.false;
  });
});
