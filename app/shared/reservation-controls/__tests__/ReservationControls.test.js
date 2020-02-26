import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import snakeCaseKeys from 'snakecase-keys';

import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import { makeButtonTests, shallowWithIntl } from '../../../utils/testUtils';
import ReservationControls from '../ReservationControls';

// This project handles API responses differently based on the method
// that is used for fetching. Data in the redux store is in camelCase,
// but data fetched through the apiClient is in snake_case. This
// component was previously used in a context where API data
// originated from the redux store, but now lives in a context where
// this data comes directly from the apiClient.

// To be able to use the same test tooling, we are transforming the
// camelCase mock objects into snake_case mock objects.
const makeReservation = (...args) => snakeCaseKeys(Reservation.build(...args));
const makeResource = (...args) => snakeCaseKeys(Resource.build(...args));

describe('shared/reservation-controls/ReservationControls', () => {
  const onCancelClick = simple.stub();
  const onConfirmClick = simple.stub();
  const onDenyClick = simple.stub();
  const onEditClick = simple.stub();
  const onInfoClick = simple.stub();

  function getWrapper(reservation, isAdmin = false, isStaff = false) {
    const defaultResource = makeResource();
    const resource = {
      ...defaultResource,
      user_permissions: { ...defaultResource.user_permissions, is_admin: isStaff },
    };
    const props = {
      isAdmin,
      onCancelClick,
      onConfirmClick,
      onDenyClick,
      onEditClick,
      onInfoClick,
      reservation: Immutable(reservation),
      resource,
    };
    return shallowWithIntl(<ReservationControls {...props} />);
  }

  describe('if user is an admin', () => {
    const isAdmin = true;

    describe('with regular reservation', () => {
      const reservation = makeReservation({ needManualConfirmation: false, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).toBe(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'edit', 'ReservationControls.edit', onEditClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'requested' });

      describe('if user has staff permissions', () => {
        const isStaff = true;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        test('renders four buttons', () => {
          expect(buttons.length).toBe(4);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'confirm', 'ReservationControls.confirm', onConfirmClick);
        });

        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'deny', 'ReservationControls.deny', onDenyClick);
        });

        describe('the fourth button', () => {
          makeButtonTests(buttons.at(3), 'edit', 'ReservationControls.edit', onEditClick);
        });
      });

      describe('if user does not have staff permissions', () => {
        const isStaff = false;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
        });
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'confirmed' });

      describe('if user has staff permissions', () => {
        const isStaff = true;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        test('renders three buttons', () => {
          expect(buttons.length).toBe(3);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });

        describe('the third button', () => {
          makeButtonTests(buttons.at(2), 'edit', 'ReservationControls.edit', onEditClick);
        });
      });

      describe('if user does not have staff permissions', () => {
        const isStaff = false;
        const buttons = getWrapper(reservation, isAdmin, isStaff).find(Button);

        test('renders two buttons', () => {
          expect(buttons.length).toBe(2);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
        });

        describe('the second button', () => {
          makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
        });
      });
    });
  });

  describe('if user is not an admin', () => {
    const isAdmin = false;

    describe('with regular reservation', () => {
      const reservation = makeReservation({ needManualConfirmation: false, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).toBe(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'edit', 'ReservationControls.edit', onEditClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });

    describe('with preliminary reservation in requested state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'requested' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders three buttons', () => {
        expect(buttons.length).toBe(3);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'edit', 'ReservationControls.edit', onEditClick);
      });

      describe('the third button', () => {
        makeButtonTests(buttons.at(2), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });

    describe('with preliminary reservation in cancelled state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'cancelled' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in denied state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'denied' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders one button', () => {
        expect(buttons.length).toBe(1);
      });

      describe('the button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });
    });

    describe('with preliminary reservation in confirmed state', () => {
      const reservation = makeReservation({ needManualConfirmation: true, state: 'confirmed' });
      const buttons = getWrapper(reservation, isAdmin).find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).toBe(2);
      });

      describe('the first button', () => {
        makeButtonTests(buttons.at(0), 'info', 'ReservationControls.info', onInfoClick);
      });

      describe('the second button', () => {
        makeButtonTests(buttons.at(1), 'cancel', 'ReservationControls.cancel', onCancelClick);
      });
    });
  });
});
