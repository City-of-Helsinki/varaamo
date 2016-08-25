import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import TimeRange from 'components/common/TimeRange';
import ReservationControls from 'containers/ReservationControls';
import ReservationsListItem from 'components/reservation/ReservationsListItem';
import Image from 'fixtures/Image';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: reservation/ReservationsListItem', () => {
  const props = {
    isAdmin: false,
    isStaff: false,
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build({
      images: [Image.build()],
    })),
    unit: Immutable(Unit.build()),
  };

  let component;

  before(() => {
    component = shallow(<ReservationsListItem {...props} />);
  });

  describe('rendering', () => {
    it('should render a li element', () => {
      expect(component.is('li')).to.be.true;
    });

    it('should display an image with correct props', () => {
      const image = component.find('img');

      expect(image).to.have.length(1);
      expect(image.props().alt).to.equal(props.resource.images[0].caption.fi);
      expect(image.props().src).to.contain(props.resource.images[0].url);
    });

    it('should contain a link to resources page', () => {
      const expectedUrl = `/resources/${props.resource.id}`;
      const resourceLink = component.find({ to: expectedUrl });

      expect(resourceLink.length > 0).to.be.true;
    });

    it('should display the name of the resource', () => {
      const expected = props.resource.name.fi;

      expect(component.find('h4').text()).to.contain(expected);
    });

    it('should display the name of the given unit in props', () => {
      const expected = props.unit.name.fi;

      expect(component.find('h4').text()).to.contain(expected);
    });

    it('should contain a Link to reservations page with correct time', () => {
      const expectedUrl = `/resources/${props.resource.id}/reservation`;
      const expectedQuery = {
        date: props.reservation.begin.split('T')[0],
        time: props.reservation.begin,
      };
      const expectedProps = { to: expectedUrl, query: expectedQuery };
      const reservationsLink = component.find(expectedProps);

      expect(reservationsLink).to.be.ok;
    });

    it('should contain two TimeRange components with correct begin and end times', () => {
      const timeRange = component.find(TimeRange);

      expect(timeRange).to.have.length(2);
      expect(timeRange.at(0).props().begin).to.equal(props.reservation.begin);
      expect(timeRange.at(0).props().end).to.equal(props.reservation.end);
      expect(timeRange.at(1).props().begin).to.equal(props.reservation.begin);
      expect(timeRange.at(1).props().end).to.equal(props.reservation.end);
    });

    it('should render ReservationControls component', () => {
      const reservationControls = component.find(ReservationControls);
      expect(reservationControls).to.have.length(1);
    });

    it('should pass correct props to ReservationControls component', () => {
      const actualProps = component.find(ReservationControls).props();

      expect(actualProps.isAdmin).to.equal(false);
      expect(actualProps.isStaff).to.equal(false);
      expect(actualProps.reservation).to.equal(props.reservation);
      expect(actualProps.resource).to.equal(props.resource);
    });
  });
});
