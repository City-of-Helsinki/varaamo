import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import ResultsCount from './ResultsCount';

describe('pages/search/results/ResultsCount', () => {
  const defaultProps = {
    emptyMessage: 'No results',
    resultIds: Immutable(['resource-1', 'resource-2']),
  };

  function getWrapper(extraProps) {
    return shallow(<ResultsCount {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    it('is rendered', () => {
      expect(getWrapper()).to.have.length(1);
    });

    it('renders correct string if there are results', () => {
      expect(getWrapper().text()).to.equal('Tiloja löytyi 2 kpl.');
    });

    it('renders emptyMessage string if no results', () => {
      expect(getWrapper({ resultIds: [] }).text()).to.equal('No results');
    });
  });
});
