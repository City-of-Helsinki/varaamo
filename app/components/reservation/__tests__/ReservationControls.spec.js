import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';

import ReservationControls from 'components/reservation/ReservationControls';
import Reservation from 'fixtures/Reservation';

describe('Component: reservation/ReservationControls', () => {
  const onCancelClick = simple.stub();
  const onDeleteClick = simple.stub();
  const onEditClick = simple.stub();

  function getWrapper(reservationState = null, isAdmin = false) {
    const props = {
      isAdmin,
      onCancelClick,
      onDeleteClick,
      onEditClick,
      reservation: Immutable(Reservation.build({ state: reservationState })),
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

  describe('with preliminary reservation in requested state', () => {
    const buttons = getWrapper('requested').find(Button);

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

      it('should be a cancel button', () => {
        expect(button.props().children).to.equal('Peru');
      });

      it('clicking the button should call onCancelClick', () => {
        onCancelClick.reset();
        button.props().onClick();

        expect(onCancelClick.callCount).to.equal(1);
      });
    });
  });

  describe('with preliminary reservation in cancelled state', () => {
    const buttons = getWrapper('cancelled').find(Button);

    it('should not render any buttons', () => {
      expect(buttons.length).to.equal(0);
    });
  });

  describe('with preliminary reservation in denied state', () => {
    const buttons = getWrapper('denied').find(Button);

    it('should not render any buttons', () => {
      expect(buttons.length).to.equal(0);
    });
  });

  describe('with preliminary reservation in confirmed state', () => {
    const buttons = getWrapper('confirmed').find(Button);

    it('should render one button', () => {
      expect(buttons.length).to.equal(1);
    });

    describe('the button', () => {
      const button = buttons.at(0);

      it('should be a cancel button', () => {
        expect(button.props().children).to.equal('Peru');
      });

      it('clicking the button should call onCancelClick', () => {
        onCancelClick.reset();
        button.props().onClick();

        expect(onCancelClick.callCount).to.equal(1);
      });
    });
  });
});
