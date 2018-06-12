import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';

import FavoriteButton from 'shared/favorite-button';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceHeader from './ResourceHeader';

describe('pages/resource/resource-header/ResourceHeader', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const defaultProps = {
    onBackClick: () => null,
    onMapClick: () => null,
    isLoggedIn: false,
    resource: Immutable(resource),
    showMap: false,
    unit: Immutable(unit),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceHeader {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders back button', () => {
      const backButton = getWrapper().find('.app-ResourceHeader__back-button');

      expect(backButton).to.have.length(1);
      expect(backButton.prop('onClick')).to.equal(defaultProps.onBackClick);
    });

    it('renders title button', () => {
      const h1 = getWrapper().find('h1');

      expect(h1).to.have.length(1);
      expect(h1.text()).to.equal(resource.name);
    });

    it('renders toggleMap button with correct props when showMap false', () => {
      const toggleMapButton = getWrapper().find('.app-ResourceHeader__map-button');
      const img = toggleMapButton.find('img');
      const span = toggleMapButton.find('span');

      expect(toggleMapButton).to.have.length(1);
      expect(toggleMapButton.prop('onClick')).to.equal(defaultProps.onMapClick);
      expect(img).to.have.length(1);
      expect(img.prop('alt')).to.equal('ResourceHeader.mapButton');
      expect(span).to.have.length(1);
      expect(span.text()).to.equal('ResourceHeader.mapButton');
    });

    it('renders toggleMap button with correct props when showMap true', () => {
      const toggleMapButton = getWrapper({ showMap: true }).find('.app-ResourceHeader__map-button');
      const img = toggleMapButton.find('img');
      const span = toggleMapButton.find('span');

      expect(toggleMapButton).to.have.length(1);
      expect(toggleMapButton.prop('onClick')).to.equal(defaultProps.onMapClick);
      expect(img.prop('alt')).to.equal('ResourceHeader.resourceButton');
      expect(span).to.have.length(1);
      expect(span.text()).to.equal('ResourceHeader.resourceButton');
    });

    describe('FavoriteButton', () => {
      it('is not rendered if user is not admin', () => {
        const favoriteButton = getWrapper({ isLoggedIn: false }).find(FavoriteButton);

        expect(favoriteButton.length).to.equal(0);
      });

      it('is rendered with correct props if user is admin', () => {
        const favoriteButton = getWrapper({ isLoggedIn: true }).find(FavoriteButton);

        expect(favoriteButton.length).to.equal(1);
        expect(favoriteButton.prop('resource')).to.deep.equal(defaultProps.resource);
      });
    });
  });
});
