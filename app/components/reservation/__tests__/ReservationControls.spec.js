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
  const onConfirmClick = simple.stub();
  const onDeleteClick = simple.stub();
  const onDenyClick = simple.stub();
  const onEditClick = simple.stub();

  function getWrapper(reservation, isAdmin = false) {
    const props = {
      isAdmin,
      onCancelClick,
      onConfirmClick,
      onDeleteClick,
      onDenyClick,
      onEditClick,
      reservation: Immutable(reservation),
    };
    return shallow(<ReservationControls {...props} />);
  }

  describe('if isAdmin is true', () => {
    const isAdmin = true;

    describe('with regular reservation', () => {
      const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

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
          expect(button.props().children).to.equal('Peru');
        });

        it('clicking the button should call onDeleteClick', () => {
          onDeleteClick.reset();
          button.props().onClick();

          expect(onDeleteClick.callCount).to.equal(1);
        });
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'requested' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('should render two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        const button = buttons.at(0);

        it('should be a confirm button', () => {
          expect(button.props().children).to.equal('Hyväksy');
        });

        it('clicking the button should call onConfirmClick', () => {
          onConfirmClick.reset();
          button.props().onClick();

          expect(onConfirmClick.callCount).to.equal(1);
        });
      });

      describe('the second button', () => {
        const button = buttons.at(1);

        it('should be a deny button', () => {
          expect(button.props().children).to.equal('Hylkää');
        });

        it('clicking the button should call onDenyClick', () => {
          onDenyClick.reset();
          button.props().onClick();

          expect(onDenyClick.callCount).to.equal(1);
        });
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('should not render any buttons', () => {
        expect(buttons.length).to.equal(0);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('should not render any buttons', () => {
        expect(buttons.length).to.equal(0);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

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

  describe('if isAdmin is false', () => {
    const isAdmin = false;

    describe('with regular reservation', () => {
      const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

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
          expect(button.props().children).to.equal('Peru');
        });

        it('clicking the button should call onDeleteClick', () => {
          onDeleteClick.reset();
          button.props().onClick();

          expect(onDeleteClick.callCount).to.equal(1);
        });
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'requested' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

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
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('should not render any buttons', () => {
        expect(buttons.length).to.equal(0);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('should not render any buttons', () => {
        expect(buttons.length).to.equal(0);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

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
});
