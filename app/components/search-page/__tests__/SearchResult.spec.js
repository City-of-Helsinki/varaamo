import {expect} from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import {fromJS} from 'immutable';

import SearchResult from 'components/search-page/SearchResult';

function setup() {
  const props = {
    result: fromJS({
      id: 'r-1',
      name: {fi: 'Some resource'},
      unit: 'u-1',
    }),
  };

  const renderer = TestUtils.createRenderer();
  renderer.render(<SearchResult {...props} />);
  const output = renderer.getRenderOutput();

  return output;
}

describe('Component: SearchResult', () => {
  describe('rendering', () => {
    let output;

    before(() => {
      output = setup();
    });

    it('should render a table row', () => {
      expect(output.type).to.equal('tr');
    });

    it('should render 2 table cells', () => {
      const tds = output.props.children;
      expect(tds).to.have.length(2);
      tds.forEach((td) => {
        expect(td.type).to.equal('td');
      });
    });

    it('first table cell should contain name of the result', () => {
      const td = output.props.children[0];
      expect(td.props.children).to.equal('Some resource');
    });

    it('second table cell should contain unit of the result', () => {
      const td = output.props.children[1];
      expect(td.props.children).to.equal('u-1');
    });
  });
});
