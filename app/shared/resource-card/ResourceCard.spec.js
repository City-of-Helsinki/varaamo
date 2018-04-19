import { expect } from 'chai';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import { browserHistory, Link } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import BackgroundImage from 'shared/background-image';
import Image from 'utils/fixtures/Image';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import Label from 'shared/label';
import ResourceAvailability from './ResourceAvailability';
import ResourceCard from './ResourceCard';

describe('shared/resource-card/ResourceCard', () => {
  function getResource(extra) {
    return Immutable(Resource.build({
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
      images: [Image.build()],
      maxPricePerHour: '30',
      peopleCapacity: '16',
      type: {
        name: 'workplace',
      },
      ...extra,
    }));
  }
  const defaultProps = {
    date: '2015-10-10',
    isLoggedIn: false,
    location: {
      pathname: 'somepath',
      search: 'somesearch',
      state: {
        scrollTop: 123,
      },
    },
    resource: getResource(),
    unit: Immutable(Unit.build({
      name: 'unit_name',
      addressZip: '00100',
      municipality: 'helsinki',
      streetAddress: 'Fabiankatu',
    })),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceCard {...defaultProps} {...extraProps} />, context);
  }

  it('renders an div element', () => {
    expect(getWrapper().is('div')).to.be.true;
  });

  it('renders stacked className if stacked prop is passed', () => {
    const resourceCard = getWrapper({ stacked: true }).filter('.app-ResourceCard__stacked');
    expect(resourceCard).to.have.length(1);
  });

  it('does not render stacked className if stacked prop is not passed', () => {
    const resourceCard = getWrapper().filter('.app-ResourceCard__stacked');
    expect(resourceCard).to.have.length(0);
  });

  describe('backgroundImage', () => {
    function getBackgroundImageWrapper(extraProps) {
      return getWrapper(extraProps).find(BackgroundImage);
    }

    it('renders BackgroundImage component with correct image', () => {
      const backgroundImage = getBackgroundImageWrapper();
      const resourceMainImage = defaultProps.resource.images[0];

      expect(backgroundImage.length).to.equal(1);
      expect(backgroundImage.prop('image')).to.deep.equal(resourceMainImage);
    });

    it('renders a label with people capacity', () => {
      const peopleCapacityLabel = getBackgroundImageWrapper().find(
        '.app-ResourceCard__peopleCapacity'
      );

      expect(peopleCapacityLabel.is(Label)).to.be.true;
      expect(peopleCapacityLabel.prop('shape')).to.equal('circle');
      expect(peopleCapacityLabel.prop('size')).to.equal('medium');
      expect(peopleCapacityLabel.prop('theme')).to.equal('orange');
      expect(peopleCapacityLabel.children().at(0).text()).to.equal('16');
      expect(peopleCapacityLabel.children().at(1).is(FontAwesome)).to.be.true;
      expect(peopleCapacityLabel.children().at(1).prop('name')).to.equal('users');
    });

    it('does not render a label with distance if not available', () => {
      const distanceLabel = getBackgroundImageWrapper().find(
        '.app-ResourceCard__distance'
      );

      expect(distanceLabel).to.have.length(0);
    });

    it('renders a label with distance', () => {
      const distanceLabel = getBackgroundImageWrapper({
        resource: getResource({ distance: 11123 }),
      }).find(
        '.app-ResourceCard__distance'
      );

      expect(distanceLabel).to.have.length(1);
      expect(distanceLabel.is(Label)).to.be.true;
      expect(distanceLabel.prop('shape')).to.equal('circle');
      expect(distanceLabel.prop('size')).to.equal('medium');
      expect(distanceLabel.prop('theme')).to.equal('copper');
      expect(distanceLabel.children().text()).to.equal('11 km');
    });

    it('renders distance with a decimal if distance is smaller than 10 km', () => {
      const distanceLabel = getBackgroundImageWrapper({
        resource: getResource({ distance: 123 }),
      }).find(
        '.app-ResourceCard__distance'
      );

      expect(distanceLabel).to.have.length(1);
      expect(distanceLabel.children().text()).to.equal('0.1 km');
    });

    it('renders a hourly price', () => {
      const hourlyPriceSpan = getBackgroundImageWrapper().find(
        '.app-ResourceCard__hourly-price'
      );

      expect(hourlyPriceSpan.is('span')).to.be.true;
      expect(hourlyPriceSpan.text()).to.contain('30 €/h');
    });
  });

  it('contains links to correct resource page', () => {
    const links = getWrapper().find(Link);
    const expectedUrl = getResourcePageUrl(defaultProps.resource, defaultProps.date);

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
    const unitName = getWrapper().find('.app-ResourceCard__unit-name').find('span');
    const expected = defaultProps.unit.name;

    expect(unitName.text()).to.contain(expected);
  });

  it('renders the street address of the given unit in props', () => {
    const unitName = getWrapper().find('.app-ResourceCard__street-address');

    expect(unitName.html()).to.contain(defaultProps.unit.addressZip);
    expect(unitName.html()).to.contain(defaultProps.unit.municipality);
    expect(unitName.html()).to.contain(defaultProps.unit.streetAddress);
  });

  it('renders an anchor that calls handleSearchByType on click', () => {
    const wrapper = getWrapper();
    const typeAnchor = wrapper.find('.app-ResourceCard__resource-type-link').filter('a');
    expect(typeAnchor).to.have.length(1);
    expect(typeAnchor.prop('onClick')).to.equal(wrapper.instance().handleSearchByType);
  });

  it('renders an anchor that calls handleSearchByUnitName on click', () => {
    const wrapper = getWrapper();
    const typeAnchor = wrapper.find('.app-ResourceCard__unit-name-link').filter('a');
    expect(typeAnchor).to.have.length(1);
    expect(typeAnchor.prop('onClick')).to.equal(wrapper.instance().handleSearchByUnitName);
  });

  it('renders a label with the type of the given resource in props', () => {
    const typeLabel = getWrapper().find('.app-ResourceCard__unit-name').find(Label);
    expect(typeLabel.prop('size')).to.equal('mini');
    expect(typeLabel.prop('theme')).to.equal('blue');
    expect(typeLabel.children().text()).to.contain(defaultProps.resource.type.name);
  });

  it('renders correct number of labels for equipment', () => {
    const equipmentLabels = getWrapper().find('.app-ResourceCard__equipment').find(Label);
    expect(equipmentLabels).to.have.length(2);
  });

  it('renders labels with the equipment of the given resource in props', () => {
    const equipmentLabels = getWrapper().find('.app-ResourceCard__equipment').find(Label);
    const equipmentLabel = equipmentLabels.at(0);
    expect(equipmentLabel.prop('shape')).to.equal('rounded');
    expect(equipmentLabel.prop('size')).to.equal('mini');
    expect(equipmentLabel.prop('theme')).to.equal('gold');
    expect(equipmentLabel.children().text()).to.contain(defaultProps.resource.equipment[0].name);
    expect(equipmentLabels.at(1).children().text()).to.contain(
      defaultProps.resource.equipment[1].name
    );
  });

  it('renders ResourceAvailability with correct props', () => {
    const resourceAvailability = getWrapper().find(ResourceAvailability);
    expect(resourceAvailability.prop('date')).to.equal(defaultProps.date);
    expect(resourceAvailability.prop('resource').id).to.equal(defaultProps.resource.id);
  });

  describe('handleSearchByType', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      getWrapper().instance().handleSearchByType();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = '/search?search=workplace';

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('handleSearchByUnitName', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      getWrapper().instance().handleSearchByUnitName();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = '/search?search=unit_name';

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('handleLinkClick', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'replace');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.replace', () => {
      getWrapper().instance().handleLinkClick();

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.have.length(1);
      expect(browserHistoryMock.lastCall.args[0].pathname).to.equal(defaultProps.location.pathname);
      expect(browserHistoryMock.lastCall.args[0].search).to.equal(defaultProps.location.search);
    });
  });
});
