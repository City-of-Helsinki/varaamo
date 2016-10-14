import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Well from 'react-bootstrap/lib/Well';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import WrappedText from 'shared/wrapped-text';
import ReservationInfo from './ReservationInfo';

describe('pages/resource/reservation-info/ReservationInfo', () => {
  const defaultProps = {
    isLoggedIn: false,
    resource: Immutable(Resource.build({
      maxPeriod: '04:00:00',
      maxReservationsPerUser: 2,
      reservable: true,
      reservationInfo: 'Some information',
    })),
  };

  function getWrapper(extraProps) {
    return shallow(<ReservationInfo {...defaultProps} {...extraProps} />);
  }

  it('renders a Well', () => {
    const well = getWrapper().find(Well);

    expect(well.length).to.equal(1);
  });

  it('renders resource.reservationInfo as WrappedText', () => {
    const wrappedText = getWrapper().find(WrappedText);
    const expectedText = defaultProps.resource.reservationInfo;

    expect(wrappedText.length).to.equal(1);
    expect(wrappedText.props().text).to.equal(expectedText);
  });

  describe('max period text', () => {
    it('is rendered correctly when resource.maxPeriod is defined', () => {
      const content = getWrapper().html();
      const expectedString = 'Varauksen maksimipituus: 4 tuntia';

      expect(content).to.contain(expectedString);
    });

    it('is not rendered if resource.maxPeriod is not defined', () => {
      const resource = { reservationInfo: '' };
      const content = getWrapper({ resource }).html();

      expect(content).to.not.contain('Varauksen maksimipituus:');
    });
  });

  describe('max reservations per user text', () => {
    it('is rendered correctly when resource.maxReservationsPerUser is defined', () => {
      const content = getWrapper().html();
      const expectedString = 'Maksimimäärä varauksia per käyttäjä: 2';

      expect(content).to.contain(expectedString);
    });

    it('is not rendered if resource.maxReservationsPerUser is not defined', () => {
      const resource = { reservationInfo: '' };
      const content = getWrapper({ resource }).html();

      expect(content).to.not.contain('Maksimimäärä varauksia per käyttäjä:');
    });
  });

  describe('login text', () => {
    it('is not rendered if user is logged in', () => {
      const content = getWrapper({ isLoggedIn: true }).html();

      expect(content).to.not.contain('kirjautua sisään');
    });

    it('is not rendered if resource is not reservable', () => {
      const resource = {
        reservable: false,
        reservationInfo: '',
      };
      const content = getWrapper({ resource }).html();

      expect(content).to.not.contain('kirjautua sisään');
    });

    it('is rendered otherwise', () => {
      const resource = {
        reservable: true,
        reservationInfo: '',
      };
      const content = getWrapper({ isLoggedIn: false, resource }).html();

      expect(content).to.contain('kirjautua sisään');
    });
  });
});
