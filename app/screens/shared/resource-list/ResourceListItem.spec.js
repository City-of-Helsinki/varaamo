import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import Immutable from 'seamless-immutable';

import Image from 'fixtures/Image';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import ResourceListItem from './ResourceListItem';

describe('screens/shared/resource-list/ResourceListItem', () => {
  const defaultProps = {
    date: '2015-10-10',
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

  it('renders an image with correct props', () => {
    const image = getWrapper().find('img');
    const resourceImage = defaultProps.resource.images[0];

    expect(image.length).to.equal(1);
    expect(image.props().alt).to.equal(resourceImage.caption.fi);
    expect(image.props().src).to.equal(`${resourceImage.url}?dim=100x100`);
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
});
