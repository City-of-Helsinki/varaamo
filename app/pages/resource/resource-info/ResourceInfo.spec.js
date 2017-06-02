import { expect } from 'chai';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import Immutable from 'seamless-immutable';

import WrappedText from 'shared/wrapped-text';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import FavoriteButton from 'shared/favorite-button';
import Label from 'shared/label';
import ImageCarousel from './ImageCarousel';
import ResourceInfo from './ResourceInfo';

describe('pages/resource/resource-info/ResourceInfo', () => {
  const defaultProps = {
    isAdmin: false,
    resource: Immutable(Resource.build({
      description: 'Some description',
      images: [{ foo: 'bar' }],
      maxPricePerHour: '30',
      peopleCapacity: '16',
      type: {
        name: 'workplace',
      },
    })),
    unit: Immutable(Unit.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceInfo {...defaultProps} {...extraProps} />);
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

  it('renders the name of the resource inside a h3 header', () => {
    const header = getWrapper().find('h3');
    const expected = defaultProps.resource.name;

    expect(header.props().children).to.contain(expected);
  });

  it('renders the unit name and address', () => {
    const unit = Unit.build({
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
    });
    const address = getWrapper({ unit }).find('.app-ResourceInfo__address');
    const expected = 'Unit name, Test street 12, 99999 Helsinki';

    expect(address.props().children).to.equal(expected);
  });

  it('renders a hourly price', () => {
    const hourlyPriceSpan = getWrapper().find(
      '.app-ResourceInfo__hourly-price'
    );

    expect(hourlyPriceSpan.text()).to.contain('30 €/h');
  });


  it('renders a label with people capacity', () => {
    const peopleCapacityLabel = getWrapper().find(
      '.app-ResourceInfo__peopleCapacity'
    );

    expect(peopleCapacityLabel.is(Label)).to.be.true;
    expect(peopleCapacityLabel.prop('shape')).to.equal('circle');
    expect(peopleCapacityLabel.prop('size')).to.equal('medium');
    expect(peopleCapacityLabel.prop('theme')).to.equal('orange');
    expect(peopleCapacityLabel.html()).to.contain('16');
    expect(peopleCapacityLabel.find(FontAwesome)).to.have.length(1);
    expect(peopleCapacityLabel.find(FontAwesome).prop('name')).to.equal('users');
  });

  it('renders a label with type name', () => {
    const typeLabel = getWrapper().find(
      '.app-ResourceInfo__type'
    );

    expect(typeLabel.is(Label)).to.be.true;
    expect(typeLabel.prop('shape')).to.equal('rounded');
    expect(typeLabel.prop('size')).to.equal('medium');
    expect(typeLabel.prop('theme')).to.equal('blue');
    expect(typeLabel.find(FontAwesome)).to.have.length(1);
    expect(typeLabel.find(FontAwesome).prop('name')).to.equal('bullseye');
    expect(typeLabel.html()).to.contain('workplace');
  });

  it('renders ImageCarousel component with correct images', () => {
    const imageCarousel = getWrapper().find(ImageCarousel);

    expect(imageCarousel.length).to.equal(1);
    expect(imageCarousel.prop('images')).to.deep.equal(defaultProps.resource.images);
  });
  describe('equipment', () => {
    const equippedResource = {
      ...defaultProps.resource,
      equipment: [
        { id: 1,
          name: 'projector',
          description: 'description a',
        },
        { id: 2,
          name: 'whiteboard',
          description: 'description b',
        },
      ],
    };
    function getEquipmentWrapper(props) {
      return getWrapper({ resource: equippedResource, ...props }).find('.app-ResourceInfo__equipment');
    }

    it('is rendered', () => {
      const equipment = getEquipmentWrapper();
      expect(equipment).to.have.length(1);
    });

    it('renders a header', () => {
      const header = getEquipmentWrapper().find('.app-ResourceInfo__equipment-header');
      expect(header.text()).to.equal('ResourceInfo.equipmentHeader');
    });

    it('renders the equipment name in labels', () => {
      const labels = getEquipmentWrapper().find(Label);
      expect(labels).to.have.length(2);
      expect(labels.children().get(0)).to.equal('projector');
      expect(labels.children().get(1)).to.equal('whiteboard');
    });

    it('renders the equipment description in table column', () => {
      const columns = getEquipmentWrapper().find('td');
      expect(columns).to.have.length(4);
      expect(columns.children().get(1)).to.equal('description a');
      expect(columns.children().get(3)).to.equal('description b');
    });
  });

  it('does not render resource equipment if empty', () => {
    const resourceEquipment = getWrapper().find('.resource-equipment');
    expect(resourceEquipment).to.have.length(0);
  });

  it('renders resource description as WrappedText', () => {
    const wrappedText = getWrapper().find(WrappedText);
    const expectedText = defaultProps.resource.description;

    expect(wrappedText.length).to.equal(1);
    expect(wrappedText.props().text).to.equal(expectedText);
  });
});
