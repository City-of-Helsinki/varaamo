import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';

import { injectT } from 'i18n';
import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Sidebar from 'shared/sidebar';

class SideNavbar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    initials: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  state = { open: true, forcedOpen: false };

  componentWillMount() {
    const mql = window.matchMedia('(min-width: 1280px)');
    this.setState({ mql });
    mql.addListener(this.onMediaQueryChanged);
    this.onMediaQueryChanged(mql);
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.onMediaQueryChanged);
  }

  onToggleSideBar = () => {
    if (!this.state.forcedOpen) {
      this.setState({ open: !this.state.open });
    }
  }

  onSetSidebarOpen = (open) => {
    this.setState({ open });
  }

  onMediaQueryChanged = (mqlEvent) => {
    this.setState({
      open: true,
      forcedOpen: mqlEvent.matches,
    });
  }

  closeSidebar = () => {
    if (!this.state.forcedOpen) {
      this.setState({ open: false });
    }
  }

  renderCloseBar() {
    return (
      !this.state.forcedOpen &&
        <a
          className="app-SideNavbar__close-bar"
          onClick={this.onToggleSideBar}
          role="button"
          tabIndex="-1"
        >
          <span>{this.props.t('SideNavbar.close')}</span>
        </a>
    );
  }

  renderContent() {
    return (
      <div className="app-SideNavbar__content">
        <Navbar onNavItemClick={this.closeSidebar} />
        <Footer onLinkClick={this.closeSidebar} />
      </div>
    );
  }

  renderSidebarContent() {
    return (
      <div className="app-SideNavbar__sidebar-content">
        {this.renderCloseBar()}
        {this.renderContent()}
      </div>
    );
  }

  render() {
    return (
      <Sidebar
        className="app-SideNavbar"
        docked
        onSetOpen={this.onSetSidebarOpen}
        open={this.state.open}
        sidebar={this.renderSidebarContent()}
      >
        <a
          className={classnames(
            'app-SideNavbar__toggle',
            {
              'app-SideNavbar__initials': this.props.initials,
              'app-SideNavbar__docked': this.state.forcedOpen,
            }
          )}
          onClick={this.onToggleSideBar}
          role="button"
          tabIndex="0"
        >
          {this.props.initials || this.props.t('SideNavbar.toggle')}
        </a>
        {this.props.children}
      </Sidebar>
    );
  }
}

export default injectT(SideNavbar);
