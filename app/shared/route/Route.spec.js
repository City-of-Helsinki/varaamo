import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import { shallow } from 'enzyme';
import { Route as ReactRouterRoute } from 'react-router-dom';

import { UnconnectedRoute as Route } from './Route';

describe('shared/reservation-controls/ReservationControls', () => {
  const updateRoute = simple.mock();
  const scrollToMock = simple.mock();

  beforeEach(() => {
    updateRoute.reset();
    scrollToMock.reset();
    simple.mock(window, 'scrollTo', scrollToMock);
  });

  const getWrapper = (componentName) => {
    const props = {
      updateRoute,
      componentName,
    };
    return shallow(<Route {...props} />);
  };

  describe('shared/route/Route', () => {
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
});
