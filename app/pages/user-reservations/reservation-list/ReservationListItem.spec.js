import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import TimeRange from 'shared/time-range';
import Image from 'utils/fixtures/Image';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import ReservationControls from 'shared/reservation-controls';
import ReservationStateLabel from 'shared/reservation-state-label';
import { getResourcePageUrl } from 'utils/resourceUtils';
import ReservationListItem from './ReservationListItem';

describe('pages/user-reservations/reservation-list/ReservationListItem', () => {
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
    component = shallow(<ReservationListItem {...props} />);
  });

  describe('rendering', () => {
    it('renders a li element', () => {
      expect(component.is('li')).to.be.true;
    });

    it('displays an image with correct props', () => {
      const image = component.find('img');

      expect(image).to.have.length(1);
      expect(image.props().alt).to.equal(props.resource.images[0].caption.fi);
      expect(image.props().src).to.contain(props.resource.images[0].url);
    });

    it('contains a link to resources page', () => {
      const expectedUrl = getResourcePageUrl(props.resource);
      const resourceLink = component.find({ to: expectedUrl });

      expect(resourceLink.length > 0).to.be.true;
    });

    it('displays the name of the resource', () => {
      const expected = props.resource.name.fi;

      expect(component.find('h4').text()).to.contain(expected);
    });

    it('displays the name of the given unit in props', () => {
      const expected = props.unit.name.fi;

      expect(component.find('h4').text()).to.contain(expected);
    });

    it('contains a Link to resource page with correct time', () => {
      const expectedUrl = getResourcePageUrl(
        props.resource,
        props.reservation.begin,
        props.reservation.begin
      );
      const expectedProps = { to: expectedUrl };
      const resourcePageLinkWithTime = component.find(expectedProps);

      expect(resourcePageLinkWithTime.length).to.equal(1);
    });

    it('contains two TimeRange components with correct begin and end times', () => {
      const timeRange = component.find(TimeRange);

      expect(timeRange).to.have.length(2);
      expect(timeRange.at(0).props().begin).to.equal(props.reservation.begin);
      expect(timeRange.at(0).props().end).to.equal(props.reservation.end);
      expect(timeRange.at(1).props().begin).to.equal(props.reservation.begin);
      expect(timeRange.at(1).props().end).to.equal(props.reservation.end);
    });

    it('renders ReservationStateLabel component', () => {
      const reservationStateLabel = component.find(ReservationStateLabel);
      expect(reservationStateLabel.length).to.equal(1);
    });

    it('renders ReservationControls component', () => {
      const reservationControls = component.find(ReservationControls);
      expect(reservationControls).to.have.length(1);
    });

    it('passes correct props to ReservationControls component', () => {
      const actualProps = component.find(ReservationControls).props();

      expect(actualProps.isAdmin).to.equal(false);
      expect(actualProps.isStaff).to.equal(false);
      expect(actualProps.reservation).to.equal(props.reservation);
      expect(actualProps.resource).to.equal(props.resource);
    });
  });
});
