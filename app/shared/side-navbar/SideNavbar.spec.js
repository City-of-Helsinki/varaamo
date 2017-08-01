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
    expect(wrapper.prop('open')).to.be.true;
  });

  it('has correct initial state', () => {
    const state = getWrapper().instance().state;
    expect(state.open).to.be.true;
    expect(state.forcedOpen).to.be.false;
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
    instance.state.open = false;
    instance.onToggleSideBar();
    expect(instance.state.open).to.be.true;
    instance.onToggleSideBar();
    expect(instance.state.open).to.be.false;
  });

  it('sets open state when calling onSetSidebarOpen', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    instance.state.open = false;
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
    instance.state.open = true;
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

  describe('docked', () => {
    it('renders docked class in toggle', () => {
      const wrapper = getWrapper();
      expect(wrapper.find('.app-SideNavbar__docked')).to.have.length(0);
      wrapper.instance().setState({ forcedOpen: true });
      expect(wrapper.update().find('.app-SideNavbar__docked')).to.have.length(1);
    });

    describe('onMediaQueryChanged', () => {
      it('sets open and forcedOpen state to true if media query has match', () => {
        const instance = getWrapper().instance();
        instance.onMediaQueryChanged({ matches: true });
        expect(instance.state.open).to.be.true;
        expect(instance.state.forcedOpen).to.be.true;
      });

      it('sets open and forcedOpen state to false if media query does not has match', () => {
        const instance = getWrapper().instance();
        instance.onMediaQueryChanged({ matches: false });
        expect(instance.state.open).to.be.true;
        expect(instance.state.forcedOpen).to.be.false;
      });
    });
    describe('onToggleSideBar', () => {
      it('does not change open state if forcedOpen is true', () => {
        const instance = getWrapper().instance();
        instance.setState({ forcedOpen: true, open: true });
        instance.onToggleSideBar();
        expect(instance.state.open).to.be.true;
      });
      it('changes open state if forcedOpen is false', () => {
        const instance = getWrapper().instance();
        instance.setState({ forcedOpen: false, open: true });
        instance.onToggleSideBar();
        expect(instance.state.open).to.be.false;
      });
    });

    describe('closeSidebar', () => {
      it('does not change open state if forcedOpen is true', () => {
        const instance = getWrapper().instance();
        instance.setState({ forcedOpen: true, open: true });
        instance.closeSidebar();
        expect(instance.state.open).to.be.true;
      });
      it('changes open state if forcedOpen is false', () => {
        const instance = getWrapper().instance();
        instance.setState({ forcedOpen: false, open: true });
        instance.closeSidebar();
        expect(instance.state.open).to.be.false;
      });
    });
    describe('renderCloseBar', () => {
      it('returns false if forcedOpen', () => {
        const instance = getWrapper().instance();
        instance.setState({ forcedOpen: true });
        expect(instance.renderCloseBar()).to.be.false;
      });

      it('returns something else than false if forcedOpen', () => {
        const instance = getWrapper().instance();
        instance.setState({ forcedOpen: false });
        expect(instance.renderCloseBar()).not.to.be.false;
      });
    });
  });
});
