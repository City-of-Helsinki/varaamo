import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Sidebar from 'shared/sidebar';

export default class SideNavbar extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = { open: false };

  onToggleSideBar = () => {
    this.setState({ open: !this.state.open });
  }

  onSetSidebarOpen = (open) => {
    this.setState({ open });
  }

  renderSidebarContent() {
    return (
      <div className="app-SideNavbar__content">
        <Navbar />
        <Footer />
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
          className="app-SideNavbar__toggle"
          onClick={this.onToggleSideBar}
          role="button"
          tabIndex="0"
        >
          <FontAwesome name="bars" />
        </a>
        {this.props.children}
      </Sidebar>
    );
  }
}
