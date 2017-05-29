import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import Immutable from 'seamless-immutable';

import BackgroundImage from 'shared/background-image';
import Image from 'utils/fixtures/Image';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrl } from 'utils/resourceUtils';
import Label from 'shared/label';
import ResourceListItem from './ResourceListItem';

describe('shared/resource-list/ResourceListItem', () => {
  const date = '2015-10-10';
  const defaultProps = {
    isLoggedIn: false,
    resource: Immutable(Resource.build({
      images: [Image.build()],
      type: {
        name: 'workplace',
      },
      equipment: [
        {
          id: '1',
          name: 'television',
        },
        {
          id: '2',
          name: 'printer',
        },
      ],
    })),
    unit: Immutable(Unit.build()),
  };
  const context = {
    location: { query: { date } },
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceListItem {...defaultProps} {...extraProps} />, { context });
  }

  it('renders an li element', () => {
    const li = getWrapper().find('li');

    expect(li.length).to.equal(1);
  });

  it('renders BackgroundImage component with correct image', () => {
    const backgroundImage = getWrapper().find(BackgroundImage);
    const resourceMainImage = defaultProps.resource.images[0];

    expect(backgroundImage.length).to.equal(1);
    expect(backgroundImage.prop('image')).to.deep.equal(resourceMainImage);
  });

  it('contains links to correct resource page', () => {
    const links = getWrapper().find(Link);
    const expectedUrl = getResourcePageUrl(defaultProps.resource, date);

    expect(links.length).to.equal(2);
    expect(links.at(0).props().to).to.equal(expectedUrl);
    expect(links.at(1).props().to).to.equal(expectedUrl);
  });

  it('renders the name of the resource inside a h4 header', () => {
    const header = getWrapper().find('h4');
    const expected = defaultProps.resource.name;

    expect(header.html()).to.contain(expected);
  });

  it('renders the name of the given unit in props', () => {
    const unitName = getWrapper().find('.app-ResourceListItem__unit-name').find('span');
    const expected = defaultProps.unit.name;

    expect(unitName.text()).to.contain(expected);
  });

  it('renders a label with the type of the given resource in props', () => {
    const typeLabel = getWrapper().find('.app-ResourceListItem__unit-name').find(Label);
    expect(typeLabel.prop('size')).to.equal('mini');
    expect(typeLabel.prop('theme')).to.equal('blue');
    expect(typeLabel.children().text()).to.contain(defaultProps.resource.type.name);
  });

  it('renders correct number of labels for equipment', () => {
    const equipmentLabels = getWrapper().find('.app-ResourceListItem__equipment').find(Label);
    expect(equipmentLabels).to.have.length(2);
  });

  it('renders labels with the equipment of the given resource in props', () => {
    const equipmentLabels = getWrapper().find('.app-ResourceListItem__equipment').find(Label);
    const equipmentLabel = equipmentLabels.at(0);
    expect(equipmentLabel.prop('shape')).to.equal('rounded');
    expect(equipmentLabel.prop('size')).to.equal('mini');
    expect(equipmentLabel.prop('theme')).to.equal('gold');
    expect(equipmentLabel.children().text()).to.contain(defaultProps.resource.equipment[0].name);
    expect(equipmentLabels.at(1).children().text()).to.contain(
      defaultProps.resource.equipment[1].name
    );
  });
});
