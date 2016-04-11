import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import queryString from 'query-string';
import Immutable from 'seamless-immutable';

import ReservationsListItem from 'components/reservation/ReservationsListItem';
import Image from 'fixtures/Image';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: reservation/ReservationsListItem', () => {
  const props = {
    confirmPreliminaryReservation: simple.stub(),
    denyPreliminaryReservation: simple.stub(),
    isAdmin: false,
    openReservationCancelModal: simple.stub(),
    openReservationDeleteModal: simple.stub(),
    openReservationInfoModal: simple.stub(),
    updatePath: simple.stub(),
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build({
      images: [Image.build()],
    })),
    selectReservationToCancel: simple.stub(),
    selectReservationToDelete: simple.stub(),
    selectReservationToEdit: simple.stub(),
    selectReservationToShow: simple.stub(),
    unit: Immutable(Unit.build()),
  };
  const tree = sd.shallowRender(<ReservationsListItem {...props} />);
  const instance = tree.getMountedInstance();

  describe('rendering', () => {
    it('should render a li element', () => {
      const vdom = tree.getRenderOutput();
      expect(vdom.type).to.equal('li');
    });

    it('should display an image with correct props', () => {
      const imageTree = tree.subTree('img');
      const image = props.resource.images[0];

      expect(imageTree).to.be.ok;
      expect(imageTree.props.alt).to.equal(image.caption.fi);
      expect(imageTree.props.src).to.contain(image.url);
    });

    it('should contain a link to resources page', () => {
      const expectedUrl = `/resources/${props.resource.id}`;
      const resourceLinkTree = tree.subTreeLike('Link', { to: expectedUrl });

      expect(resourceLinkTree).to.be.ok;
    });

    it('should display the name of the resource', () => {
      const expected = props.resource.name.fi;

      expect(tree.toString()).to.contain(expected);
    });

    it('should display the name of the given unit in props', () => {
      const expected = props.unit.name.fi;

      expect(tree.toString()).to.contain(expected);
    });

    it('should contain a Link to reservations page with correct time', () => {
      const expectedUrl = `/resources/${props.resource.id}/reservation`;
      const expectedQuery = {
        date: props.reservation.begin.split('T')[0],
        time: props.reservation.begin,
      };
      const expectedProps = { to: expectedUrl, query: expectedQuery };
      const reservationsLinkTree = tree.subTreeLike('Link', expectedProps);

      expect(reservationsLinkTree).to.be.ok;
    });

    it('should contain a TimeRange component with correct begin and end times', () => {
      const timeRangeTree = tree.subTree('TimeRange');

      expect(timeRangeTree.props.begin).to.equal(props.reservation.begin);
      expect(timeRangeTree.props.end).to.equal(props.reservation.end);
    });

    describe('rendering ReservationControls', () => {
      const reservationControlsTree = tree.subTree('ReservationControls');

      it('should render ReservationControls component', () => {
        expect(reservationControlsTree).to.be.ok;
      });

      it('should pass correct props to ReservationControls component', () => {
        const actualProps = reservationControlsTree.props;

        expect(actualProps.reservation).to.equal(props.reservation);
        expect(actualProps.isAdmin).to.equal(false);
        expect(actualProps.onCancelClick).to.equal(instance.handleCancelClick);
        expect(actualProps.onDeleteClick).to.equal(instance.handleDeleteClick);
        expect(actualProps.onEditClick).to.equal(instance.handleEditClick);
      });
    });
  });

  describe('handleCancelClick', () => {
    instance.handleCancelClick();

    it('should call props.selectReservationToCancel with this reservation', () => {
      expect(props.selectReservationToCancel.callCount).to.equal(1);
      expect(
        props.selectReservationToCancel.lastCall.args[0]
      ).to.deep.equal(
        props.reservation
      );
    });

    it('should call the props.openReservationCancelModal function', () => {
      expect(props.openReservationCancelModal.callCount).to.equal(1);
    });
  });

  describe('handleDeleteClick', () => {
    instance.handleDeleteClick();

    it('should call props.selectReservationToDelete with this reservation', () => {
      expect(props.selectReservationToDelete.callCount).to.equal(1);
      expect(
        props.selectReservationToDelete.lastCall.args[0]
      ).to.deep.equal(
        props.reservation
      );
    });

    it('should call the props.openReservationDeleteModal function', () => {
      expect(props.openReservationDeleteModal.callCount).to.equal(1);
    });
  });

  describe('handleEditClick', () => {
    instance.handleEditClick();

    it('should call props.selectReservationToEdit with reservation and minPeriod', () => {
      expect(props.selectReservationToEdit.callCount).to.equal(1);
      expect(
        props.selectReservationToEdit.lastCall.args[0]
      ).to.deep.equal(
        { reservation: props.reservation, minPeriod: props.resource.minPeriod }
      );
    });

    it('should call the props.updatePath with correct url', () => {
      const actualUrlArg = props.updatePath.lastCall.args[0];
      const query = queryString.stringify({
        date: props.reservation.begin.split('T')[0],
        time: props.reservation.begin,
      });
      const expectedUrl = `/resources/${props.reservation.resource}/reservation?${query}`;

      expect(props.updatePath.callCount).to.equal(1);
      expect(actualUrlArg).to.equal(expectedUrl);
    });
  });

  describe('handleInfoClick', () => {
    instance.handleInfoClick();

    it('should call props.selectReservationToShow with this reservation', () => {
      expect(props.selectReservationToShow.callCount).to.equal(1);
      expect(
        props.selectReservationToShow.lastCall.args[0]
      ).to.deep.equal(
        props.reservation
      );
    });

    it('should call the props.openReservationInfoModal function', () => {
      expect(props.openReservationInfoModal.callCount).to.equal(1);
    });
  });
});
