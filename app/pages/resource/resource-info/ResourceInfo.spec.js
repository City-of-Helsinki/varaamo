import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Immutable from 'seamless-immutable';

import WrappedText from 'shared/wrapped-text';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceInfo from './ResourceInfo';
import ReservationInfo from '../reservation-info';

describe('pages/resource/resource-info/ResourceInfo', () => {
  const defaultProps = {
    isLoggedIn: false,
    resource: Immutable(
      Resource.build({
        description: 'Some description',
        genericTerms: 'some generic terms',
        specificTerms: 'some specific terms',
        maxPricePerHour: '30',
        peopleCapacity: '16',
        type: {
          name: 'workplace',
        },
      })
    ),
    unit: Immutable(Unit.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceInfo {...defaultProps} {...extraProps} />);
  }

  test('renders resource description as WrappedText', () => {
    const wrappedText = getWrapper()
      .find('.app-ResourceInfo__description')
      .find(WrappedText);
    const expectedText = defaultProps.resource.description;

    expect(wrappedText).toHaveLength(1);
    expect(wrappedText.prop('text')).toBe(expectedText);
    expect(wrappedText.prop('openLinksInNewTab')).toBe(true);
  });

  test('renders panels with correct header text', () => {
    const panels = getWrapper().find(Panel);

    expect(panels).toHaveLength(2);
    expect(panels.at(0).prop('header')).toBe('ResourceInfo.reservationTitle');
    expect(panels.at(1).prop('header')).toBe('ResourceInfo.additionalInfoTitle');
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
    const link = getWrapper({ unit })
      .find('.app-ResourceInfo__www')
      .find('a');

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
    const expected = 'https://palvelukartta.hel.fi/unit/123#!route-details';
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
});
