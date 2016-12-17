import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';

import { shallowWithIntl } from 'utils/testUtils';
import ResultsCount from './ResultsCount';

describe('pages/search/results/ResultsCount', () => {
  const defaultProps = {
    emptyMessage: 'No results',
    resultIds: Immutable(['resource-1', 'resource-2']),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResultsCount {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    it('is rendered', () => {
      expect(getWrapper()).to.have.length(1);
    });

    it('renders correct string if there are results', () => {
      expect(getWrapper().text()).to.equal('ResultsCount.text');
    });

    it('renders emptyMessage string if no results', () => {
      expect(getWrapper({ resultIds: [] }).text()).to.equal('No results');
    });
  });
});
