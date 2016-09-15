import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Label from 'react-bootstrap/lib/Label';
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

  describe('names section', () => {
    let namesLink;

    before(() => {
      const namesSection = getWrapper().find('.names');
      namesLink = namesSection.find(Link);
    });

    it('contains a link to resources page', () => {
      expect(namesLink.length).to.equal(1);
      expect(namesLink.props().to).to.contain('resources');
    });

    it('renders the name of the resource', () => {
      const expected = defaultProps.resource.name.fi;

      expect(namesLink.html()).to.contain(expected);
    });

    it('renders the name of the given unit in props', () => {
      const expected = defaultProps.unit.name.fi;

      expect(namesLink.html()).to.contain(expected);
    });
  });

  describe('available time', () => {
    let availableTime;

    before(() => {
      availableTime = getWrapper().find('.available-time');
    });

    it('contains a Link to reservations page with a correct date', () => {
      const link = availableTime.find('Link');

      expect(link.length).to.equal(1);
      expect(link.props().to).to.equal(`/resources/${defaultProps.resource.id}/reservation`);
      expect(link.props().query).to.deep.equal({
        date: defaultProps.date.split('T')[0],
      });
    });

    it('displays the available hours in a label', () => {
      const label = availableTime.find(Label);
      const expected = '0 tuntia vapaana';

      expect(label.props().children).to.equal(expected);
    });
  });
});
