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

  state = { open: true };

  onToggleSideBar = () => {
    this.setState({ open: !this.state.open });
  }

  onSetSidebarOpen = (open) => {
    this.setState({ open });
  }

  closeSidebar = () => {
    this.setState({ open: false });
  }

  renderCloseBar() {
    return (
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
            { 'app-SideNavbar__initials': this.props.initials }
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
