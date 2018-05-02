import { expect } from 'chai';
import React from 'react';
import { browserHistory, Link } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import BackgroundImage from 'shared/background-image';
import Image from 'utils/fixtures/Image';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
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
      id: 'unit_value',
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

      expect(backgroundImage).to.have.length(1);
      expect(backgroundImage.prop('image')).to.deep.equal(resourceMainImage);
    });
  });

  describe('people capacity', () => {
    it('renders people capacity', () => {
      const peopleCapacity = getWrapper().find('.app-ResourceCard__peopleCapacity');

      expect(peopleCapacity).to.have.length(1);
      expect(peopleCapacity.text()).to.contain('ResourceCard.peopleCapacity');
    });
  });

  describe('distance', () => {
    it('does not render distance if not available', () => {
      const distanceLabel = getWrapper().find('.app-ResourceCard__distance');
      expect(distanceLabel).to.have.length(1);
      expect(distanceLabel.text()).to.equal(' ');
    });

    it('renders distance', () => {
      const distanceLabel = getWrapper({
        resource: getResource({ distance: 11123 }),
      }).find(
        '.app-ResourceCard__distance'
      );

      expect(distanceLabel).to.have.length(1);
      expect(distanceLabel.text()).to.equal('11 km');
    });

    it('renders distance with a decimal if distance is smaller than 10 km', () => {
      const distanceLabel = getWrapper({
        resource: getResource({ distance: 123 }),
      }).find(
        '.app-ResourceCard__distance'
      );

      expect(distanceLabel).to.have.length(1);
      expect(distanceLabel.text()).to.equal('0.1 km');
    });
  });

  describe('price', () => {
    it('renders a hourly price', () => {
      const hourlyPriceSpan = getWrapper().find(
        '.app-ResourceCard__hourly-price'
      );

      expect(hourlyPriceSpan.is('span')).to.be.true;
      expect(hourlyPriceSpan.text()).to.contain('30 €/h');
    });

    it('renders correct text if minPricePerHourand maxPricePerHour are 0', () => {
      const resource = getResource({
        maxPricePerHour: 0,
        minPricePerHour: 0,
      });
      const hourlyPriceSpan = getWrapper({ resource }).find(
        '.app-ResourceCard__hourly-price'
      );

      expect(hourlyPriceSpan.is('span')).to.be.true;
      expect(hourlyPriceSpan.text()).to.contain('ResourceIcons.free');
    });

    it('renders correct text if resource minPricePerHour and maxPricePerHour is empty', () => {
      const resource = getResource({
        maxPricePerHour: '',
        minPricePerHour: '',
      });
      const hourlyPriceSpan = getWrapper({ resource }).find(
        '.app-ResourceCard__hourly-price'
      );

      expect(hourlyPriceSpan.is('span')).to.be.true;
      expect(hourlyPriceSpan.text()).to.contain('ResourceIcons.free');
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
    const wrapper = getWrapper();
    const streetAddress = wrapper.find('.app-ResourceCard__street-address');
    const zipAddress = wrapper.find('.app-ResourceCard__zip-address');

    expect(streetAddress).to.have.length(1);
    expect(streetAddress.html()).to.contain(defaultProps.unit.streetAddress);
    expect(zipAddress).to.have.length(1);
    expect(zipAddress.html()).to.contain(defaultProps.unit.addressZip);
    expect(zipAddress.html()).to.contain(defaultProps.unit.municipality);
  });

  it('renders an anchor that calls handleSearchByType on click', () => {
    const wrapper = getWrapper();
    const typeAnchor = wrapper.find('.app-ResourceCard__info-link-capitalize').filter('a');
    expect(typeAnchor).to.have.length(1);
    expect(typeAnchor.prop('onClick')).to.equal(wrapper.instance().handleSearchByType);
  });

  it('renders an anchor that calls handleSearchByUnitName on click', () => {
    const wrapper = getWrapper();
    const unitAnchor = wrapper.find('.app-ResourceCard__unit-name-link');
    expect(unitAnchor).to.have.length(1);
    expect(unitAnchor.prop('onClick')).to.equal(wrapper.instance().handleSearchByUnit);
  });

  it('renders the type of the given resource in props', () => {
    const typeLabel = getWrapper().find('.app-ResourceCard__unit-name').find('span');
    expect(typeLabel).to.have.length(1);
    expect(typeLabel.text()).to.equal(defaultProps.unit.name);
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

  describe('handleSearchByDistance', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      getWrapper({
        resource: getResource({ distance: 5000 }),
      }).instance().handleSearchByDistance();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = '/search?distance=5000';

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('handleSearchByPeopleCapacity', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      getWrapper().instance().handleSearchByPeopleCapacity();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = '/search?people=16';

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('handleSearchByUnit', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      getWrapper().instance().handleSearchByUnit();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = '/search?unit=unit_value';

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
