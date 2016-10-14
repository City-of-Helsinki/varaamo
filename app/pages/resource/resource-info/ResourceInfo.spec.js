import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import WrappedText from 'shared/wrapped-text';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import FavoriteButton from 'shared/favorite-button';
import ResourceIcons from 'shared/resource-icons';
import { getAddressWithName } from 'utils/unitUtils';
import ImageCarousel from './ImageCarousel';
import ResourceInfo from './ResourceInfo';

describe('pages/resource/resource-info/ResourceInfo', () => {
  const defaultProps = {
    isAdmin: false,
    resource: Immutable(Resource.build({
      description: { fi: 'Some description' },
      images: [{ foo: 'bar' }],
    })),
    unit: Immutable(Unit.build()),
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceInfo {...defaultProps} {...extraProps} />);
  }

  describe('FavoriteButton', () => {
    it('is not rendered if user is not admin', () => {
      const favoriteButton = getWrapper({ isAdmin: false }).find(FavoriteButton);

      expect(favoriteButton.length).to.equal(0);
    });

    it('is rendered with correct props if user is admin', () => {
      const favoriteButton = getWrapper({ isAdmin: true }).find(FavoriteButton);

      expect(favoriteButton.length).to.equal(1);
      expect(favoriteButton.prop('resource')).to.deep.equal(defaultProps.resource);
    });
  });

  it('renders the name of the resource inside a h1 header', () => {
    const header = getWrapper().find('h1');
    const expected = defaultProps.resource.name.fi;

    expect(header.props().children).to.equal(expected);
  });

  it('renders the unit address with name inside an address tag', () => {
    const address = getWrapper().find('address');
    const expected = getAddressWithName(defaultProps.unit);

    expect(address.props().children).to.equal(expected);
  });

  it('renders ResourceIcons component', () => {
    const resourceIcons = getWrapper().find(ResourceIcons);

    expect(resourceIcons.length).to.equal(1);
  });

  it('renders ImageCarousel component with correct images', () => {
    const imageCarousel = getWrapper().find(ImageCarousel);

    expect(imageCarousel.length).to.equal(1);
    expect(imageCarousel.prop('images')).to.deep.equal(defaultProps.resource.images);
  });

  it('renders resource description as WrappedText', () => {
    const wrappedText = getWrapper().find(WrappedText);
    const expectedText = defaultProps.resource.description.fi;

    expect(wrappedText.length).to.equal(1);
    expect(wrappedText.props().text).to.equal(expectedText);
  });
});
