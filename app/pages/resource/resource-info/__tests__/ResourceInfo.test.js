import React from 'react';
import Immutable from 'seamless-immutable';
import toJson from 'enzyme-to-json';

import WrappedText from '../../../../shared/wrapped-text/WrappedText';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceInfo from '../ResourceInfo';
import ReservationInfo from '../../reservation-info/ReservationInfo';
import AccessibilityInformation from '../../../../utils/fixtures/AccessibilityInformation';

describe('pages/resource/resource-info/ResourceInfo', () => {
  const defaultProps = {
    isLoggedIn: false,
    resource: Immutable(
      Resource.build({
        description: 'Some description',
        genericTerms: 'some generic terms',
        specificTerms: 'some specific terms',
        paymentTerms: 'some payment terms',
        maxPricePerHour: '30',
        peopleCapacity: '16',
        type: {
          name: 'workplace',
        },
      }),
    ),
    unit: Immutable(Unit.build()),
    currentEquipments: [
      {
        name: {
          fi: 'Karaokelaitteisto',
          en: 'Karaoke equipment',
          sv: 'Karaoke-utrustning',
        },
      },
    ],
    accessibilityInformation: Immutable(
      AccessibilityInformation.build(
        {},
        {
          nShortcomings: 2,
          nDetails: 3,
        },
      ),
    ),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceInfo {...defaultProps} {...extraProps} />);
  }

  test('renders correctly', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders resource description as WrappedText', () => {
    const wrappedText = getWrapper()
      .find('.app-ResourceInfo__description')
      .find(WrappedText);
    const expectedText = defaultProps.resource.description;

    expect(wrappedText).toHaveLength(1);
    expect(wrappedText.prop('text')).toBe(expectedText);
    expect(wrappedText.prop('openLinksInNewTab')).toBe(true);
  });

  test('renders ReservationInfo with correct props', () => {
    const reservationInfo = getWrapper().find(ReservationInfo);
    expect(reservationInfo).toHaveLength(1);
    expect(reservationInfo.prop('isLoggedIn')).toBe(defaultProps.isLoggedIn);
    expect(reservationInfo.prop('resource')).toEqual(defaultProps.resource);
  });

  test('renders the unit name and address', () => {
    const unit = Unit.build({
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
    });
    const addressSpan = getWrapper({ unit })
      .find('.app-ResourceInfo__address')
      .find('span');

    expect(addressSpan).toHaveLength(3);
    expect(addressSpan.at(0).text()).toBe(unit.name);
    expect(addressSpan.at(1).text()).toBe(unit.streetAddress);
    expect(addressSpan.at(2).text()).toBe('99999 Helsinki');
  });

  test('renders web address', () => {
    const unit = Unit.build({
      id: 'abc:123',
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
      wwwUrl: 'some-url',
    });
    const link = getWrapper({ unit }).find('.app-ResourceInfo__www').find('a');

    expect(link).toHaveLength(1);
    expect(link.prop('href')).toBe(unit.wwwUrl);
    expect(link.prop('target')).toBe('_blank');
  });

  test('renders service map link', () => {
    const unit = Unit.build({
      id: 'abc:123',
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
      wwwUrl: 'some-url',
    });
    const expected = 'https://palvelukartta.hel.fi/unit/123';
    const link = getWrapper({ unit })
      .find('.app-ResourceInfo__servicemap')
      .find('a');

    expect(link).toHaveLength(1);
    expect(link.prop('href')).toBe(expected);
    expect(link.prop('target')).toBe('_blank');
  });

  test('does not render service map link if unit empty', () => {
    const link = getWrapper({ unit: {} })
      .find('.app-ResourceInfo__servicemap')
      .find('a');

    expect(link).toHaveLength(0);
  });

  test('renders payment terms when resource has products and a paymentTerms field', () => {
    const resource = Resource.build({
      description: 'Some description',
      genericTerms: 'some generic terms',
      specificTerms: 'some specific terms',
      paymentTerms: 'some payment terms',
      products: [{}],
      maxPricePerHour: '30',
      peopleCapacity: '16',
      type: {
        name: 'workplace',
      },
    });
    const wrapper = getWrapper({ resource });

    expect(wrapper.find({ header: 'paymentTerms.title' }).length).toEqual(1);
  });

  test('renders accessibility details panel when accessibilityInformation is given', () => {
    const wrapper = getWrapper();
    expect(
      wrapper.find({ className: 'app-ResourceInfo__accessibility' }),
    ).toHaveLength(1);
  });

  test('does not render accessibility details when accessibilityInformation is not given', () => {
    const { accessibilityInformation, ...props } = defaultProps;
    const wrapper = shallowWithIntl(<ResourceInfo {...props} />);
    expect(
      wrapper.find({ className: 'app-ResourceInfo__accessibility' }),
    ).toHaveLength(0);
  });
});
