import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import { makeButtonTests } from 'utils/testUtils';
import ReservationControls from './ReservationControls';

describe('shared/reservation-controls/ReservationControls', () => {
  const onCancelClick = simple.stub();
  const onConfirmClick = simple.stub();
  const onDenyClick = simple.stub();
  const onEditClick = simple.stub();
  const onInfoClick = simple.stub();

  function getWrapper(reservation, isAdmin = false, isStaff = false) {
    const props = {
      isAdmin,
      isStaff,
      onCancelClick,
      onConfirmClick,
      onDenyClick,
      onEditClick,
      onInfoClick,
      reservation: Immutable(reservation),
    };
    return shallow(<ReservationControls {...props} />);
  }

  describe('if user is an admin', () => {
    const isAdmin = true;

    describe('with regular reservation', () => {
      const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'edit', 'Muokkaa', onEditClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'Peru', onCancelClick);
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'requested' });

      describe('if user has staff permissions', () => {
        const isStaff = true;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        it('renders four buttons', () => {
          expect(buttons.length).to.equal(4);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'confirm', 'Hyväksy', onConfirmClick);
        });

        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'deny', 'Hylkää', onDenyClick);
        });

        describe('the fourth button', () => {
          makeButtonTests(buttons.at(3), 'edit', 'Muokkaa', onEditClick);
        });
      });

      describe('if user does not have staff permissions', () => {
        const isStaff = false;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        it('renders two buttons', () => {
          expect(buttons.length).to.equal(2);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'Muokkaa', onEditClick);
        });
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders one button', () => {
        expect(buttons.length).to.equal(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders one button', () => {
        expect(buttons.length).to.equal(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'confirmed' });

      describe('if user has staff permissions', () => {
        const isStaff = true;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        it('renders three buttons', () => {
          expect(buttons.length).to.equal(3);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'Peru', onCancelClick);
        });

        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'edit', 'Muokkaa', onEditClick);
        });
      });

      describe('if user does not have staff permissions', () => {
        const isStaff = false;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        it('renders two buttons', () => {
          expect(buttons.length).to.equal(2);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'Peru', onCancelClick);
        });
      });
    });
  });

  describe('if user is not an admin', () => {
    const isAdmin = false;

    describe('with regular reservation', () => {
      const reservation = Reservation.build({ needManualConfirmation: false, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'edit', 'Muokkaa', onEditClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'Peru', onCancelClick);
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'requested' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders three buttons', () => {
        expect(buttons.length).to.equal(3);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'edit', 'Muokkaa', onEditClick);
      });

      describe('the third button', () => {
        makeButtonTests(buttons.at(2), 'cancel', 'Peru', onCancelClick);
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders one button', () => {
        expect(buttons.length).to.equal(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders one button', () => {
        expect(buttons.length).to.equal(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = Reservation.build({ needManualConfirmation: true, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'Tiedot', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'Peru', onCancelClick);
      });
    });
  });
});
