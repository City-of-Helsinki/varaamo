import React from 'react';
import { Link } from 'react-router-dom';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import iconHeart from 'hel-icons/dist/shapes/heart-o.svg';

import BackgroundImage from 'shared/background-image';
import Image from 'utils/fixtures/Image';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getResourcePageUrlComponents } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceAvailability from './label/ResourceAvailability';
import { UnconnectedResourceCard } from './ResourceCardContainer';
import UnpublishedLabel from 'shared/label/Unpublished';
import ResourceCardInfoCell from './info';
import iconHeartWhite from 'assets/icons/heart-white.svg';

describe('shared/resource-card/ResourceCardContainer', () => {
  function getResource(extra) {
    return Immutable(
      Resource.build({
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
      })
    );
  }

  const history = {
    push: () => { },
    replace: () => { },
  };

  const defaultProps = {
    actions: {
      favoriteResource: jest.fn(),
      unfavoriteResource: jest.fn(),
    },
    history,
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
    unit: Immutable(
      Unit.build({
        id: 'unit_value',
        name: 'unit_name',
        addressZip: '00100',
        municipality: 'helsinki',
        streetAddress: 'Fabiankatu',
      })
    ),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<UnconnectedResourceCard {...defaultProps} {...extraProps} />);
  }

  test('renders an div element', () => {
    expect(getWrapper().is('div')).toBe(true);
  });

  test('renders stacked className if stacked prop is passed', () => {
    const resourceCard = getWrapper({ stacked: true }).filter('.app-ResourceCard__stacked');
    expect(resourceCard).toHaveLength(1);
  });

  test('does not render stacked className if stacked prop is not passed', () => {
    const resourceCard = getWrapper().filter('.app-ResourceCard__stacked');
    expect(resourceCard).toHaveLength(0);
  });

  describe('backgroundImage', () => {
    function getBackgroundImageWrapper(extraProps) {
      return getWrapper(extraProps).find(BackgroundImage);
    }

    test('renders BackgroundImage component with correct image', () => {
      const backgroundImage = getBackgroundImageWrapper();
      const resourceMainImage = defaultProps.resource.images[0];

      expect(backgroundImage).toHaveLength(1);
      expect(backgroundImage.prop('image')).toEqual(resourceMainImage);
    });
  });

  describe('info box', () => {
    test('render with 5 ResourceCardInfoCell cells', () => {
      const info = getWrapper().find('.app-ResourceCard__info');
      const cells = info.find(ResourceCardInfoCell);
      expect(cells.length).toEqual(5);
    });

    test('render with first ResourceCardInfoCell', () => {
      const info = getWrapper().find('.app-ResourceCard__info');
      const cell = info.find(ResourceCardInfoCell).first();

      expect(cell.prop('alt')).toEqual(defaultProps.resource.type.name);
      expect(cell.prop('icon')).toBeDefined();
      expect(cell.prop('onClick')).toBeDefined();
    });

    test('will not render favorite icon as default if user not logged in', () => {
      const info = getWrapper().find('.app-ResourceCard__info');
      const cell = info.find(ResourceCardInfoCell)[5];

      expect(cell).toBeUndefined();
    });

    test('render with favorite icon as default if user logged in', () => {
      const info = getWrapper({ isLoggedIn: true }).find('.app-ResourceCard__info');
      const cell = info.find(ResourceCardInfoCell).last();

      expect(cell.prop('alt')).toEqual(defaultProps.resource.type.name);
      expect(cell.prop('icon')).toEqual(iconHeart);
      expect(cell.prop('onClick')).toBeDefined();
    });

    test('render with unfavorite icon when isFavorite is true, user logged in', () => {
      const info = getWrapper({
        resource: getResource({ isFavorite: true, isLoggedIn: true })
      }).find('.app-ResourceCard__info');
      const cell = info.find(ResourceCardInfoCell).last();

      expect(cell.prop('alt')).toEqual(defaultProps.resource.type.name);
      expect(cell.prop('icon')).toEqual(iconHeartWhite);
      expect(cell.prop('onClick')).toBeDefined();
    });

    test('invoke favorite func when favorite icon is clicked as default, user logged in', () => {
      const info = getWrapper({ isLoggedIn: true }).find('.app-ResourceCard__info');
      const cell = info.find(ResourceCardInfoCell).last();
      cell.simulate('click');
      expect(defaultProps.actions.favoriteResource).toHaveBeenCalledTimes(1);
    });

    test('invoke set unfavorite func when favorite icon is clicked, user logged in', () => {
      const info = getWrapper({
        resource: getResource({ isFavorite: true }),
        isLoggedIn: true
      }).find('.app-ResourceCard__info');
      const cell = info.find(ResourceCardInfoCell).last();
      cell.simulate('click');
      expect(defaultProps.actions.unfavoriteResource).toHaveBeenCalledTimes(1);
    });
  });

  describe('people capacity', () => {
    test('renders people capacity', () => {
      const peopleCapacity = getWrapper().find('.app-ResourceCard__peopleCapacity');

      expect(peopleCapacity).toHaveLength(1);
      expect(peopleCapacity.text()).toContain('ResourceCard.peopleCapacity');
    });
  });

  describe('distance', () => {
    test('does not render distance if not available', () => {
      const distanceLabel = getWrapper().find('.app-ResourceCard__distance');
      expect(distanceLabel).toHaveLength(1);
      expect(distanceLabel.text()).toBe('\u00A0');
    });

    test('renders distance', () => {
      const distanceLabel = getWrapper({
        resource: getResource({ distance: 11123 }),
      }).find('.app-ResourceCard__distance');

      expect(distanceLabel).toHaveLength(1);
      expect(distanceLabel.text()).toBe('11 km');
    });

    test(
      'renders distance with a decimal if distance is smaller than 10 km',
      () => {
        const distanceLabel = getWrapper({
          resource: getResource({ distance: 123 }),
        }).find('.app-ResourceCard__distance');

        expect(distanceLabel).toHaveLength(1);
        expect(distanceLabel.text()).toBe('0.1 km');
      }
    );
  });

  describe('price', () => {
    test('renders a hourly price', () => {
      const hourlyPriceSpan = getWrapper().find('.app-ResourceCard__hourly-price');

      expect(hourlyPriceSpan.is('span')).toBe(true);
      expect(hourlyPriceSpan.text()).toContain('30 €/h');
    });

    test(
      'renders correct text if minPricePerHourand maxPricePerHour are 0',
      () => {
        const resource = getResource({
          maxPricePerHour: 0,
          minPricePerHour: 0,
        });
        const hourlyPriceSpan = getWrapper({ resource }).find('.app-ResourceCard__hourly-price');

        expect(hourlyPriceSpan.is('span')).toBe(true);
        expect(hourlyPriceSpan.text()).toContain('ResourceIcons.free');
      }
    );

    test(
      'renders correct text if resource minPricePerHour and maxPricePerHour is empty',
      () => {
        const resource = getResource({
          maxPricePerHour: '',
          minPricePerHour: '',
        });
        const hourlyPriceSpan = getWrapper({ resource }).find('.app-ResourceCard__hourly-price');

        expect(hourlyPriceSpan.is('span')).toBe(true);
        expect(hourlyPriceSpan.text()).toContain('ResourceIcons.free');
      }
    );
  });

  test('contains links to correct resource page', () => {
    const links = getWrapper().find(Link);
    const urlComponents = getResourcePageUrlComponents(defaultProps.resource, defaultProps.date);
    const expected = {
      pathname: urlComponents.pathname,
      search: `?${urlComponents.query}`,
      state: { fromSearchResults: true },
    };

    expect(links.length).toBe(2);
    expect(links.at(0).props().to).toEqual(expected);
    expect(links.at(1).props().to).toEqual(expected);
  });

  test('renders the name of the resource inside a h4 header', () => {
    const header = getWrapper().find('h4');
    const expected = defaultProps.resource.name;

    expect(header.html()).toContain(expected);
  });

  test('renders the name of the given unit in props', () => {
    const unitName = getWrapper()
      .find('.app-ResourceCard__unit-name')
      .find('span');
    const expected = defaultProps.unit.name;

    expect(unitName.text()).toContain(expected);
  });

  test('renders the street address of the given unit in props', () => {
    const wrapper = getWrapper();
    const streetAddress = wrapper.find('.app-ResourceCard__street-address');
    const zipAddress = wrapper.find('.app-ResourceCard__zip-address');

    expect(streetAddress).toHaveLength(1);
    expect(streetAddress.html()).toContain(defaultProps.unit.streetAddress);
    expect(zipAddress).toHaveLength(1);
    expect(zipAddress.html()).toContain(defaultProps.unit.addressZip);
    expect(zipAddress.html()).toContain(defaultProps.unit.municipality);
  });

  test('renders an anchor that calls handleSearchByUnitName on click', () => {
    const wrapper = getWrapper();
    const unitAnchor = wrapper.find('.app-ResourceCard__unit-name-link');
    expect(unitAnchor).toHaveLength(1);
    expect(unitAnchor.prop('onClick')).toBe(wrapper.instance().handleSearchByUnit);
  });

  test('renders the type of the given resource in props', () => {
    const typeLabel = getWrapper()
      .find('.app-ResourceCard__unit-name')
      .find('span');
    expect(typeLabel).toHaveLength(1);
    expect(typeLabel.text()).toBe(defaultProps.unit.name);
  });

  test('renders ResourceAvailability with correct props', () => {
    const resourceAvailability = getWrapper().find(ResourceAvailability);
    expect(resourceAvailability.prop('date')).toBe(defaultProps.date);
    expect(resourceAvailability.prop('resource').id).toBe(defaultProps.resource.id);
  });

  test('renders UnpublishedLabel when resource public is false', () => {
    const unpublishedLabel = getWrapper(
      { resource: getResource({ public: false }) }
    ).find(UnpublishedLabel);

    expect(unpublishedLabel.length).toEqual(1);
  });

  test('no renders UnpublishedLabel when resource public is true', () => {
    const unpublishedLabel = getWrapper(
      { resource: getResource({ public: true }) }
    ).find(UnpublishedLabel);

    expect(unpublishedLabel.length).toEqual(0);
  });

  describe('handleSearchByType', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history.push with correct path', () => {
      getWrapper()
        .instance()
        .handleSearchByType();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?search=workplace';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleSearchByDistance', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history.push with correct path', () => {
      getWrapper({
        resource: getResource({ distance: 5000 }),
      })
        .instance()
        .handleSearchByDistance();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?distance=5000';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleSearchByPeopleCapacity', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls history.push with correct path', () => {
      getWrapper()
        .instance()
        .handleSearchByPeopleCapacity();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?people=16';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleSearchByUnit', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory.push with correct path', () => {
      getWrapper()
        .instance()
        .handleSearchByUnit();
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = '/search?unit=unit_value';

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleLinkClick', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'replace');
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory.replace', () => {
      getWrapper()
        .instance()
        .handleLinkClick();

      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toHaveLength(1);
      expect(historyMock.lastCall.args[0].pathname).toBe(defaultProps.location.pathname);
      expect(historyMock.lastCall.args[0].search).toBe(defaultProps.location.search);
    });
  });
});
