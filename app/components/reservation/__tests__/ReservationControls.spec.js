import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';

import ReservationControls from 'components/reservation/ReservationControls';
import Reservation from 'fixtures/Reservation';

describe('Component: reservation/ReservationControls', () => {
  const onDeleteClick = simple.stub();
  const onEditClick = simple.stub();

  function getWrapper(reservationStatus = null) {
    const props = {
      onDeleteClick,
      onEditClick,
      reservation: Immutable(Reservation.build({ status: reservationStatus })),
    };
    return shallow(<ReservationControls {...props} />);
  }

  describe('with normal reservation', () => {
    const buttons = getWrapper().find(Button);

    it('should render two buttons', () => {
      expect(buttons.length).to.equal(2);
    });

    describe('the first button', () => {
      const button = buttons.at(0);

      it('should be an edit button', () => {
        expect(button.props().children).to.equal('Muokkaa');
      });

      it('clicking the button should call onEditClick', () => {
        onEditClick.reset();
        button.props().onClick();

        expect(onEditClick.callCount).to.equal(1);
      });
    });

    describe('the second button', () => {
      const button = buttons.at(1);

      it('should be a delete button', () => {
        expect(button.props().children).to.equal('Poista');
      });

      it('clicking the button should call onDeleteClick', () => {
        onDeleteClick.reset();
        button.props().onClick();

        expect(onDeleteClick.callCount).to.equal(1);
      });
    });
  });

  describe('with preliminary reservation in pending state', () => {
    const buttons = getWrapper('pending').find(Button);

    it('should render one button', () => {
      expect(buttons.length).to.equal(1);
    });

    describe('the button', () => {
      const button = buttons.at(0);

      it('should be an edit button', () => {
        expect(button.props().children).to.equal('Muokkaa');
      });

      it('clicking the button should call onEditClick', () => {
        onEditClick.reset();
        button.props().onClick();

        expect(onEditClick.callCount).to.equal(1);
      });
    });
  });

  describe('with preliminary reservation in canceled state', () => {
    const buttons = getWrapper('canceled').find(Button);

    it('should not render any buttons', () => {
      expect(buttons.length).to.equal(0);
    });
  });

  describe('with preliminary reservation in declined state', () => {
    const buttons = getWrapper('declined').find(Button);

    it('should not render any buttons', () => {
      expect(buttons.length).to.equal(0);
    });
  });

  describe('with preliminary reservation in accepted state', () => {
    const buttons = getWrapper('accepted').find(Button);

    it('should not render any buttons', () => {
      expect(buttons.length).to.equal(0);
    });
  });
});
