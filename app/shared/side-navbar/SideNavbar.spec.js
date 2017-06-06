import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Sidebar from 'shared/sidebar';
import SideNavbar from './SideNavbar';

function getWrapper(children = 'Some text') {
  return shallow(<SideNavbar>{children}</SideNavbar>);
}

describe('shared/side-navbar/SideNavbar', () => {
  it('renders a Sidebar', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(Sidebar)).to.be.true;
  });

  it('has correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper.prop('docked')).to.be.true;
    expect(wrapper.prop('className')).to.equal('app-SideNavbar');
    expect(wrapper.prop('onSetOpen')).to.equal(wrapper.instance().onSetSidebarOpen);
    expect(wrapper.prop('open')).to.be.false;
  });

  it('renders sidebar content', () => {
    const sidebarContentWrapper = shallow(getWrapper().prop('sidebar'));
    expect(sidebarContentWrapper.prop('className')).to.equal('app-SideNavbar__content');
    expect(sidebarContentWrapper.find(Navbar)).to.have.length(1);
    expect(sidebarContentWrapper.find(Footer)).to.have.length(1);
  });

  it('has a toggle', () => {
    const wrapper = getWrapper();
    const toggle = wrapper.find('.app-SideNavbar__toggle');
    expect(toggle.prop('onClick')).to.equal(wrapper.instance().onToggleSideBar);
  });

  it('toggles open state when calling onToggleSideBar', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(instance.state.open).to.be.false;
    instance.onToggleSideBar();
    expect(instance.state.open).to.be.true;
    instance.onToggleSideBar();
    expect(instance.state.open).to.be.false;
  });

  it('sets open state when calling onSetSidebarOpen', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(instance.state.open).to.be.false;
    instance.onSetSidebarOpen(true);
    expect(instance.state.open).to.be.true;
    instance.onSetSidebarOpen(true);
    expect(instance.state.open).to.be.true;
    instance.onSetSidebarOpen(false);
    expect(instance.state.open).to.be.false;
  });
});
