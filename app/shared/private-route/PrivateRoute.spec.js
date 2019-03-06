import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import * as redux from 'redux';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';

import * as routeActions from 'actions/routeActions';
import {
  UnconnectedPrivateRoute as PrivateRoute,
  mapStateToProps,
  mapDispatchToProps,
} from './PrivateRoute';

describe('shared/private-route/PrivateRoute', () => {
  describe('UnconnectedPrivateRoute', () => {
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
        actions: { updateRoute },
        location: {},
        componentName,
        component,
        userId,
      };
      return shallow(<PrivateRoute {...props} />);
    };

    test('renders Route from react-router-dom', () => {
      const wrapper = getWrapper('AdminPage', '1234');

      expect(wrapper.is(Route)).to.be.true;
    });

    test('calls updateRoute when the component did mount', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().componentDidMount();

      expect(updateRoute.callCount).to.equal(1);
    });

    test('calls scrollTo when the component did update', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().componentDidMount();

      expect(scrollToMock.callCount).to.equal(1);
    });

    test('calls updateRoute when the component did update', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().componentDidUpdate();

      expect(updateRoute.callCount).to.equal(1);
    });

    test('does not calls window.location.replace if the userId is defined', () => {
      const wrapper = getWrapper('AdminPage', '1234');
      wrapper.instance().renderOrRedirect();

      expect(redirectMock.callCount).to.equal(0);
    });
  });

  describe('mapStateToProps', () => {
    test('returns an object with userId property', () => {
      expect(mapStateToProps({})).to.have.property('userId');
    });
  });

  describe('mapDispatchToProps', () => {
    beforeEach(() => {
      simple.mock(redux, 'bindActionCreators');
      simple.mock(routeActions, 'updateRoute').returnWith(() => {});
    });

    afterEach(() => {
      simple.restore();
    });

    const dispatch = () => {};
    const ownProps = { componentName: 'adminPage' };

    test('returns an object with actions property', () => {
      expect(mapDispatchToProps(dispatch, ownProps)).to.have.property('actions');
    });

    test('calls updateRoute with componentName prop', () => {
      mapDispatchToProps(dispatch, ownProps);

      expect(routeActions.updateRoute.calls[0].arg).to.equal(ownProps.componentName);
    });

    test('calls bindActionCreators with the correct arguments', () => {
      mapDispatchToProps(dispatch, ownProps);

      expect(redux.bindActionCreators.calls[0].args[0]).to.have.property(
        'updateRoute',
        routeActions.updateRoute(ownProps.componentName)
      );
      expect(redux.bindActionCreators.calls[0].args[1]).to.equal(dispatch);
    });
  });
});
