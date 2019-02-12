import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import { UnconnectedPrivateRoute as PrivateRoute } from './PrivateRoute';

describe('shared/private-route/PrivateRoute', () => {
  const component = () => <div>private route</div>;

  const updateRoute = simple.mock();
  const scrollToMock = simple.mock();
  const redirectMock = simple.mock();

  beforeEach(() => {
    updateRoute.reset();
    scrollToMock.reset();
    redirectMock.reset();
    simple.mock(window, 'scrollTo', scrollToMock);
    simple.mock(window.location, 'replace', redirectMock);
  });

  const getWrapper = (componentName, userId) => {
    const props = {
      updateRoute,
      componentName,
      component,
      userId,
    };
    return shallow(<PrivateRoute {...props} />);
  };

  it('renders Route from react-router-dom', () => {
    const wrapper = getWrapper('AdminPage', '1234');

    expect(wrapper.is(Route)).to.be.true;
  });

  it('calls updateRoute when the component did mount', () => {
    const wrapper = getWrapper('AdminPage', '1234');
    wrapper.instance().componentDidMount();

    expect(updateRoute.callCount).to.equal(1);
  });

  it('calls scrollTo when the component did update', () => {
    const wrapper = getWrapper('AdminPage', '1234');
    wrapper.instance().componentDidMount();

    expect(scrollToMock.callCount).to.equal(1);
  });

  it('calls updateRoute when the component did update', () => {
    const wrapper = getWrapper('AdminPage', '1234');
    wrapper.instance().componentDidUpdate();

    expect(updateRoute.callCount).to.equal(1);
  });

  it('does not calls window.location.replace if the userId is defined', () => {
    const wrapper = getWrapper('AdminPage', '1234');
    wrapper.instance().renderOrRedirect();

    expect(redirectMock.callCount).to.equal(0);
  });
});
