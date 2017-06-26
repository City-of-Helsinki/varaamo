import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Sidebar from 'shared/sidebar';
import SideNavbar from './SideNavbar';

function getWrapper(props = {}, children = 'Some text') {
  const defaultProps = {
    t: () => {},
    initials: null,
  };
  return shallowWithIntl(<SideNavbar {...defaultProps} {...props}>{children}</SideNavbar>);
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
    expect(sidebarContentWrapper.prop('className')).to.equal('app-SideNavbar__sidebar-content');
    expect(sidebarContentWrapper.find(Navbar)).to.have.length(1);
    expect(sidebarContentWrapper.find(Footer)).to.have.length(1);
  });

  it('renders sidebar close bar with correct text', () => {
    const sidebarContentWrapper = shallow(getWrapper().prop('sidebar'));
    const closeBar = sidebarContentWrapper.find('.app-SideNavbar__close-bar');
    expect(closeBar.find({ children: 'SideNavbar.close' })).to.have.length(1);
  });


  it('has a toggle', () => {
    const wrapper = getWrapper();
    const toggle = wrapper.find('.app-SideNavbar__toggle');
    expect(toggle.prop('onClick')).to.equal(wrapper.instance().onToggleSideBar);
  });

  it('renders guess text in toggle', () => {
    const wrapper = getWrapper();
    const toggle = wrapper.find('.app-SideNavbar__toggle');
    expect(toggle.prop('children')).to.equal('SideNavbar.toggle');
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

  it('sets closed state when calling closeSidebar', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    instance.setState({ open: true });
    expect(instance.state.open).to.be.true;
    instance.closeSidebar();
    expect(instance.state.open).to.be.false;
    instance.closeSidebar();
    expect(instance.state.open).to.be.false;
  });


  describe('with initials', () => {
    it('renders initials in toggle', () => {
      const wrapper = getWrapper({ initials: 'RG' });
      const toggle = wrapper.find('.app-SideNavbar__toggle');
      expect(toggle.prop('children')).to.equal('RG');
    });

    it('renders initials class in toggle', () => {
      const wrapper = getWrapper({ initials: 'RG' });
      const toggle = wrapper.find('.app-SideNavbar__toggle.app-SideNavbar__initials');
      expect(toggle).to.have.length(1);
    });
  });
});
