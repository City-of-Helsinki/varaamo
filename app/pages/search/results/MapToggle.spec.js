import { expect } from 'chai';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import MapToggle from './MapToggle';

describe('pages/search/results/MapToggle', () => {
  function getWrapper(props) {
    const defaults = {
      mapVisible: false,
      onClick: () => null,
      resultCount: 0,
    };
    return shallowWithIntl(<MapToggle {...defaults} {...props} />);
  }

  test('renders div.app-MapToggle', () => {
    expect(getWrapper().is('div.app-MapToggle')).to.be.true;
  });

  describe('result count text', () => {
    function getResultsCountText(resultCount) {
      return getWrapper({ resultCount }).find('.app-MapToggle__results-count').text();
    }

    test('renders correct string if there are results', () => {
      expect(getResultsCountText(12)).to.equal('MapToggle.resultsText');
    });

    test('renders empty message string if no results', () => {
      expect(getResultsCountText(0)).to.equal('MapToggle.noResultsText');
    });
  });

  describe('buttons', () => {
    test('renders list button disabled if map is not visible', () => {
      const wrapper = getWrapper({ mapVisible: false });
      const listButton = wrapper.find('.app-MapToggle__button-list');
      const mapButton = wrapper.find('.app-MapToggle__button-map');
      expect(listButton.length).to.equal(1);
      expect(listButton.prop('disabled')).to.be.true;
      expect(mapButton.length).to.equal(1);
      expect(mapButton.prop('disabled')).to.be.false;
    });

    test('renders map button disabled if map is visible', () => {
      const wrapper = getWrapper({ mapVisible: true });
      const listButton = wrapper.find('.app-MapToggle__button-list');
      const mapButton = wrapper.find('.app-MapToggle__button-map');
      expect(listButton.length).to.equal(1);
      expect(listButton.prop('disabled')).to.be.false;
      expect(mapButton.length).to.equal(1);
      expect(mapButton.prop('disabled')).to.be.true;
    });
  });
});
