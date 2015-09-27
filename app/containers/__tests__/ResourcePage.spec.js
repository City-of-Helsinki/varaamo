import {expect} from 'chai';
import React from 'react';
import {findDOMNode} from 'react-dom';
import TestUtils from 'react/lib/ReactTestUtils';

import {fromJS} from 'immutable';

import {UnconnectedResourcePage as ResourcePage} from 'containers/ResourcePage';

describe('Container: ResourcePage', () => {
  const name = 'Some resource';
  const props = {
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
});
