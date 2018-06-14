import { expect } from 'chai';
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
    resource: Immutable(Resource.build({
      description: 'Some description',
      genericTerms: 'some generic terms',
      specificTerms: 'some specific terms',
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

  it('renders resource description as WrappedText', () => {
    const wrappedText = getWrapper().find('.app-ResourceInfo__description').find(WrappedText);
    const expectedText = defaultProps.resource.description;

    expect(wrappedText).to.have.length(1);
    expect(wrappedText.prop('text')).to.equal(expectedText);
  });

  it('renders collapsible panels with correct props', () => {
    const panels = getWrapper().find(Panel);

    expect(panels).to.have.length(2);
    expect(panels.at(0).prop('header')).to.equal('ResourceInfo.reservationTitle');
    expect(panels.at(0).prop('collapsible')).to.be.true;
    expect(panels.at(1).prop('header')).to.equal('ResourceInfo.additionalInfoTitle');
    expect(panels.at(1).prop('collapsible')).to.be.true;
  });

  it('renders ReservationInfo with correct props', () => {
    const reservationInfo = getWrapper().find(ReservationInfo);
    expect(reservationInfo).to.have.length(1);
    expect(reservationInfo.prop('isLoggedIn')).to.equal(defaultProps.isLoggedIn);
    expect(reservationInfo.prop('resource')).to.deep.equal(defaultProps.resource);
  });

  it('renders the unit name and address', () => {
    const unit = Unit.build({
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
    });
    const addressSpan = getWrapper({ unit }).find('.app-ResourceInfo__address').find('span');

    expect(addressSpan).to.have.length(3);
    expect(addressSpan.at(0).text()).to.equal(unit.name);
    expect(addressSpan.at(1).text()).to.equal(unit.streetAddress);
    expect(addressSpan.at(2).text()).to.equal('99999 Helsinki');
  });

  it('renders web address', () => {
    const unit = Unit.build({
      id: 'abc:123',
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
      wwwUrl: 'some-url',
    });
    const link = getWrapper({ unit }).find('.app-ResourceInfo__www').find('a');

    expect(link).to.have.length(1);
    expect(link.prop('href')).to.equal(unit.wwwUrl);
  });

  it('renders service map link', () => {
    const unit = Unit.build({
      id: 'abc:123',
      addressZip: '99999',
      municipality: 'helsinki',
      name: 'Unit name',
      streetAddress: 'Test street 12',
      wwwUrl: 'some-url',
    });
    const expected = 'https://palvelukartta.hel.fi/unit/123#!route-details';
    const link = getWrapper({ unit }).find('.app-ResourceInfo__servicemap').find('a');

    expect(link).to.have.length(1);
    expect(link.prop('href')).to.equal(expected);
  });

  it('does not render service map link if unit empty', () => {
    const link = getWrapper({ unit: {} }).find('.app-ResourceInfo__servicemap').find('a');

    expect(link).to.have.length(0);
  });

  it('renders termsAndConditions', () => {
    const termsAndConditions = getWrapper().find('.app-ResourceInfo__terms');
    const { genericTerms, specificTerms } = defaultProps.resource;
    const expected = `${specificTerms}\n\n${genericTerms}`;
    expect(termsAndConditions.is(WrappedText)).to.be.true;
    expect(termsAndConditions.prop('text')).to.equal(expected);
  });
});
