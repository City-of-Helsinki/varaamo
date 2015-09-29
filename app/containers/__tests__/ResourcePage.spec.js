import { expect } from 'chai';
import React from 'react';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';

import { fromJS } from 'immutable';

import { UnconnectedResourcePage as ResourcePage } from 'containers/ResourcePage';

describe('Container: ResourcePage', () => {
  let fetchResourceWasCalled = false;
  function fetchResourceMock() {
    fetchResourceWasCalled = true;
  }
  const name = 'Some resource';
  const props = {
    actions: { fetchResource: fetchResourceMock },
    id: 'r-1',
    resource: fromJS({
      name: {
        fi: name,
      },
    }),
  };
  let page;

  before(() => {
    page = TestUtils.renderIntoDocument(<ResourcePage {...props} />);
  });

  describe('rendering', () => {
    it('should render without problems', () => {
      expect(page).to.be.ok;
    });

    it('should set a correct page title', () => {
      expect(document.title).to.equal(`${name} - Respa`);
    });

    it('should display resource name inside h1 tags', () => {
      const headerComponent = TestUtils.findRenderedDOMComponentWithTag(page, 'h1');
      const headerDOM = findDOMNode(headerComponent);
      expect(headerDOM.textContent).to.equal(name);
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      expect(fetchResourceWasCalled).to.be.true;
    });
  });
});
