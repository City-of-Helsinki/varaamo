import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
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

  function getWrapper(props) {
    return shallowWithIntl(<ReservationInfo {...defaultProps} {...props} />);
  }

  it('renders a app-ReservationInfo', () => {
    const element = getWrapper().find('.app-ReservationInfo');
    expect(element.length).to.equal(1);
  });

  it('renders resource.reservationInfo as WrappedText', () => {
    const wrappedText = getWrapper().find(WrappedText);
    expect(wrappedText.length).to.equal(1);
    expect(wrappedText.props().text).to.equal(defaultProps.resource.reservationInfo);
  });

  describe('max length text', () => {
    it('is rendered correctly when resource.maxPeriod is defined', () => {
      const maxLengthText = getWrapper().find('.max-length-text');
      expect(maxLengthText).to.have.length(1);
    });

    it('is not rendered if resource.maxPeriod is not defined', () => {
      const resource = {};
      const maxLengthText = getWrapper({ resource }).find('.max-length-text');
      expect(maxLengthText).to.have.length(0);
    });
  });

  describe('max reservations per user text', () => {
    it('is rendered correctly when resource.maxReservationsPerUser is defined', () => {
      const maxReservationsText = getWrapper().find('.max-number-of-reservations-text');
      expect(maxReservationsText).to.have.length(1);
    });

    it('is not rendered if resource.maxReservationsPerUser is not defined', () => {
      const resource = {};
      const maxReservationsText = getWrapper({ resource }).find('.max-number-of-reservations-text');
      expect(maxReservationsText).to.have.length(0);
    });
  });

  describe('login text', () => {
    it('is not rendered if user is logged in', () => {
      const loginText = getWrapper({ isLoggedIn: true }).find('.login-text');
      expect(loginText).to.have.length(0);
    });

    it('is not rendered if resource is not reservable', () => {
      const resource = {
        reservable: false,
      };
      const loginText = getWrapper({ resource }).find('.login-text');
      expect(loginText).to.have.length(0);
    });

    it('is rendered otherwise', () => {
      const resource = {
        reservable: true,
      };
      const loginText = getWrapper({ isLoggedIn: false, resource }).find('.login-text');
      expect(loginText).to.have.length(1);
    });
  });
});
