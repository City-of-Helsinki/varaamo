import { expect } from 'chai';
import React from 'react';
import Sticky from 'react-sticky-el';
import { shallow } from 'enzyme';

import MainNavbar from 'shared/main-navbar';
import TopNavbar from 'shared/top-navbar';
import Header from './Header';

describe('shared/header/Header', () => {
  const pathname = 'somepath';
  function getWrapper() {
    const defaults = {
      location: { pathname },
    };
    return shallow(
      <Header {...defaults}>
        <div id="child-div" />
      </Header>
    );
  }

  it('renders top navbar', () => {
    const topNavbar = getWrapper().find(TopNavbar);
    expect(topNavbar).to.have.length(1);
  });

  it('renders sticky', () => {
    const sticky = getWrapper().find(Sticky);
    expect(sticky).to.have.length(1);
  });

  it('renders main navbar', () => {
    const mainNavbar = getWrapper().find(MainNavbar);
    expect(mainNavbar).to.have.length(1);
    expect(mainNavbar.at(0).prop('activeLink')).to.equal(pathname);
  });

  it('renders props.children', () => {
    const children = getWrapper().find('#child-div');
    expect(children).to.have.length(1);
  });
});
