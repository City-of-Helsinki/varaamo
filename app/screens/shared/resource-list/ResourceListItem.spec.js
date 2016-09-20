import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import Immutable from 'seamless-immutable';

import Image from 'fixtures/Image';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import ReserveButton from './ReserveButton';
import ResourceListItem from './ResourceListItem';

describe('screens/shared/resource-list/ResourceListItem', () => {
  const defaultProps = {
    date: '2015-10-10',
    isLoggedIn: false,
    resource: Immutable(Resource.build({
      images: [Image.build()],
    })),
    unit: Immutable(Unit.build()),
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceListItem {...defaultProps} {...extraProps} />);
  }

  it('renders an li element', () => {
    const li = getWrapper().find('li');

    expect(li.length).to.equal(1);
  });

  it('renders an image container with correct background image', () => {
    const imageContainer = getWrapper().find('.image-container');
    const resourceImage = defaultProps.resource.images[0];

    expect(imageContainer.length).to.equal(1);
    expect(imageContainer.props().style.backgroundImage).to.contain(resourceImage.url);
  });

  it('contains a link to resources page', () => {
    const link = getWrapper().find(Link);

    expect(link.length).to.equal(1);
    expect(link.props().to).to.contain('resources');
  });

  it('renders the name of the resource inside the link', () => {
    const link = getWrapper().find(Link);
    const expected = defaultProps.resource.name.fi;

    expect(link.html()).to.contain(expected);
  });

  it('renders the name of the given unit in props', () => {
    const unitName = getWrapper().find('.unit-name');
    const expected = defaultProps.unit.name.fi;

    expect(unitName.text()).to.contain(expected);
  });

  it('renders a ReserveButton with correct props', () => {
    const reserveButton = getWrapper().find(ReserveButton);

    expect(reserveButton.length).to.equal(1);
    expect(reserveButton.props().date).to.equal(defaultProps.date);
    expect(reserveButton.props().isLoggedIn).to.equal(defaultProps.isLoggedIn);
    expect(reserveButton.props().resource).to.equal(defaultProps.resource);
  });
});
