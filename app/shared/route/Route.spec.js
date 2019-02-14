import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import * as redux from 'redux';
import { shallow } from 'enzyme';
import { Route as ReactRouterRoute } from 'react-router-dom';

import * as routeActions from 'actions/routeActions';
import { UnconnectedRoute as Route, mapDispatchToProps } from './Route';

describe('shared/route/Route', () => {
  describe('UnconnectedRoute', () => {
    const updateRoute = simple.mock();
    const scrollToMock = simple.mock();

    beforeEach(() => {
      updateRoute.reset();
      scrollToMock.reset();
      simple.mock(window, 'scrollTo', scrollToMock);
    });

    const getWrapper = (componentName) => {
      const props = {
        actions: { updateRoute },
        location: {},
        componentName,
      };
      return shallow(<Route {...props} />);
    };

    it('renders Route from react-router-dom', () => {
      const wrapper = getWrapper('Homepage');

      expect(wrapper.is(ReactRouterRoute)).to.be.true;
    });

    it('calls updateRoute when the component did mount', () => {
      const wrapper = getWrapper('Homepage');
      wrapper.instance().componentDidMount();

      expect(updateRoute.callCount).to.equal(1);
    });

    it('calls scrollTo when the component did update', () => {
      const wrapper = getWrapper('Homepage');
      wrapper.instance().componentDidMount();

      expect(scrollToMock.callCount).to.equal(1);
    });

    it('calls updateRoute when the component did update', () => {
      const wrapper = getWrapper('Homepage');
      wrapper.instance().componentDidUpdate();

      expect(updateRoute.callCount).to.equal(1);
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
    const ownProps = { componentName: 'homepage' };

    it('returns an object with actions property', () => {
      expect(mapDispatchToProps(dispatch, ownProps)).to.have.property('actions');
    });

    it('calls updateRoute with componentName prop', () => {
      mapDispatchToProps(dispatch, ownProps);

      expect(routeActions.updateRoute.calls[0].arg).to.equal(ownProps.componentName);
    });

    it('calls bindActionCreators with the correct arguments', () => {
      mapDispatchToProps(dispatch, ownProps);

      expect(redux.bindActionCreators.calls[0].args[0]).to.have.property(
        'updateRoute',
        routeActions.updateRoute(ownProps.componentName)
      );
      expect(redux.bindActionCreators.calls[0].args[1]).to.equal(dispatch);
    });
  });
});
