import { expect } from 'chai';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { shallowWithIntl } from 'utils/testUtils';
import MapToggle from './MapToggle';

describe('pages/search/results/MapToggle', () => {
  function getWrapper(props) {
    const defaults = {
      mapVisible: false,
      onClick: () => null,
      resultsCount: 0,
    };
    return shallowWithIntl(<MapToggle {...defaults} {...props} />);
  }

  it('renders button.app-MapToggle', () => {
    expect(getWrapper().is('button.app-MapToggle')).to.be.true;
  });

  describe('results count text', () => {
    function getResultsCountText(resultsCount) {
      return getWrapper({ resultsCount }).find('.app-MapToggle__results-count').text();
    }

    it('renders correct string if there are results', () => {
      expect(getResultsCountText(12)).to.equal('MapToggle.resultsText');
    });

    it('renders empty message string if no results', () => {
      expect(getResultsCountText(0)).to.equal('MapToggle.noResultsText');
    });
  });

  describe('button text', () => {
    function getButtonText(mapVisible) {
      return getWrapper({ mapVisible }).text();
    }

    it('renders show map text if map is not visible', () => {
      expect(getButtonText(false)).to.contain('MapToggle.showMap');
    });

    it('renders show list text if map is visible', () => {
      expect(getButtonText(true)).to.contain('MapToggle.showList');
    });
  });

  describe('button text', () => {
    function getButtonIcon(mapVisible) {
      return getWrapper({ mapVisible }).find('.app-MapToggle__icon').find(Glyphicon);
    }

    it('renders show map icon if map is not visible', () => {
      expect(getButtonIcon(false).prop('glyph')).to.equal('map-marker');
    });

    it('renders show list icon if map is visible', () => {
      expect(getButtonIcon(true).prop('glyph')).to.equal('list');
    });
  });
});
