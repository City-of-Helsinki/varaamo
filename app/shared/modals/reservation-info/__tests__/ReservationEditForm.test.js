import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Immutable from 'seamless-immutable';
import { Field, Fields } from 'redux-form';

import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import User from '../../../../utils/fixtures/User';
import { shallowWithIntl } from '../../../../utils/testUtils';
import { UnconnectedReservationEditForm as ReservationEditForm } from '../ReservationEditForm';

describe('shared/modals/reservation-info/ReservationEditForm', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({
    billingAddressCity: 'New York',
    billingAddressStreet: 'Billing Street 11',
    billingAddressZip: '99999',
    reserverId: '112233-123A',
    comments: 'Just some comments.',
    eventDescription: 'Jedi mind tricks',
    eventSubject: 'Jedi Party',
    numberOfParticipants: 12,
    reserverAddressCity: 'Mos Eisley',
    reserverAddressStreet: 'Cantina street 3B',
    reserverAddressZip: '11111',
    reserverEmailAddress: 'luke@sky.com',
    reserverName: 'Luke Skywalker',
    reserverPhoneNumber: '1234567',
    resource: resource.id,
  });
  const defaultProps = {
    handleSubmit: () => null,
    isAdmin: true,
    isEditing: false,
    isSaving: false,
    isStaff: false,
    onCancelEditClick: () => null,
    onStartEditClick: () => null,
    reservation: Immutable(reservation),
    reservationIsEditable: false,
    resource: Immutable(resource),
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationEditForm {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Form component', () => {
      expect(getWrapper().find(Form)).toHaveLength(1);
    });

    describe('reservation data', () => {
      function getData(props) {
        return getWrapper(props).find(Form).html();
      }

      test('renders billingAddressCity', () => {
        expect(getData()).toContain(reservation.billingAddressCity);
      });

      test('renders billingAddressStreet', () => {
        expect(getData()).toContain(reservation.billingAddressStreet);
      });

      test('renders billingAddressZip', () => {
        expect(getData()).toContain(reservation.billingAddressZip);
      });

      describe('comments', () => {
        test('are not rendered if user is not an admin', () => {
          const props = {
            isAdmin: false,
            reservationIsEditable: false,
          };
          expect(getData(props)).not.toContain(reservation.comments);
        });

        test('are not rendered if reservation is editable', () => {
          const props = {
            isAdmin: true,
            reservationIsEditable: true,
          };
          expect(getData(props)).not.toContain(reservation.comments);
        });

        test('are rendered if user is admin and reservation is not editable', () => {
          const props = {
            isAdmin: true,
            reservationIsEditable: false,
          };
          expect(getData(props)).toContain(reservation.comments);
        });
      });

      test('renders eventDescription', () => {
        expect(getData()).toContain(reservation.eventDescription);
      });

      test('renders eventSubject', () => {
        expect(getData()).toContain(reservation.eventSubject);
      });

      test('renders numberOfParticipants', () => {
        expect(getData()).toContain(reservation.numberOfParticipants);
      });

      test('renders reserverAddressCity', () => {
        expect(getData()).toContain(reservation.reserverAddressCity);
      });

      test('renders reserverAddressStreet', () => {
        expect(getData()).toContain(reservation.reserverAddressStreet);
      });

      test('renders reserverAddressZip', () => {
        expect(getData()).toContain(reservation.reserverAddressZip);
      });

      test('renders reserverEmailAddress', () => {
        expect(getData()).toContain(reservation.reserverEmailAddress);
      });

      describe('reserverId', () => {
        test('is rendered if user has staff rights', () => {
          expect(getData({ isStaff: true })).toContain(reservation.reserverId);
        });

        test('is not rendered if user does not have staff rights', () => {
          expect(getData({ isStaff: false })).not.toContain(reservation.reserverId);
        });
      });

      test('renders reserverName', () => {
        expect(getData()).toContain(reservation.reserverName);
      });

      test('renders reserverPhoneNumber', () => {
        expect(getData()).toContain(reservation.reserverPhoneNumber);
      });

      describe('user name and email', () => {
        const user = User.build({
          displayName: 'display name',
          email: 'some@email.com',
        });
        const userReservation = Reservation.build({
          reserverName: null,
          reserverEmailAddress: null,
          user,
        });

        test('renders reservation user name when reserverName is empty', () => {
          expect(getData({ reservation: userReservation })).toContain(user.displayName);
        });

        test(
          'renders reservation user email when reserverEmailAddress is empty',
          () => {
            expect(getData({ reservation: userReservation })).toContain(user.email);
          },
        );
      });
    });

    describe('form fields', () => {
      describe('when editing', () => {
        function getFormField(name) {
          return getWrapper({ isEditing: true }).find(Field).filter({ name });
        }

        test('renders a text field for eventSubject', () => {
          const field = getFormField('eventSubject');
          expect(field).toHaveLength(1);
          expect(field.prop('type')).toBe('text');
        });

        test('renders a textarea field for eventDescription', () => {
          const field = getFormField('eventDescription');
          expect(field).toHaveLength(1);
          expect(field.prop('type')).toBe('textarea');
        });

        test('renders a number field for numberOfParticipants', () => {
          const field = getFormField('numberOfParticipants');
          expect(field).toHaveLength(1);
          expect(field.prop('type')).toBe('number');
        });

        test('renders ReservationTimeControls', () => {
          const timeControls = getWrapper({ isEditing: true })
            .find(Fields)
            .filter({ names: ['begin', 'end'] });
          expect(timeControls).toHaveLength(1);
        });
      });

      describe('when not editing', () => {
        test('does not render any form fields', () => {
          expect(getWrapper({ isEditing: false }).find(Field)).toHaveLength(0);
          expect(getWrapper({ isEditing: false }).find(Fields)).toHaveLength(0);
        });
      });
    });

    describe('form controls', () => {
      function getFormControls(props) {
        return getWrapper(props).find('.form-controls');
      }

      test('are not rendered if user is not an admin', () => {
        const props = {
          isAdmin: false,
          reservationIsEditable: true,
        };
        expect(getFormControls(props)).toHaveLength(0);
      });

      test('are not rendered if reservation is not editable', () => {
        const props = {
          isAdmin: true,
          reservationIsEditable: false,
        };
        expect(getFormControls(props)).toHaveLength(0);
      });

      test('are rendered if user is admin and reservation is editable', () => {
        const props = {
          isAdmin: true,
          reservationIsEditable: true,
        };
        expect(getFormControls(props)).toHaveLength(1);
      });

      describe('edit button', () => {
        function getEditButton(props) {
          const onStartEditClick = () => null;
          const defaults = {
            isAdmin: true,
            onStartEditClick,
            reservationIsEditable: true,
          };
          const wrapper = getFormControls({ ...defaults, ...props });
          return wrapper.find(Button).filter({ onClick: onStartEditClick });
        }

        test('is rendered if isEditing is false', () => {
          expect(getEditButton({ isEditing: false })).toHaveLength(1);
        });

        test('is not rendered if isEditing is true', () => {
          expect(getEditButton({ isEditing: true })).toHaveLength(0);
        });
      });

      describe('cancel button', () => {
        function getEditButton(props) {
          const onCancelEditClick = () => null;
          const defaults = {
            isAdmin: true,
            onCancelEditClick,
            reservationIsEditable: true,
          };
          const wrapper = getFormControls({ ...defaults, ...props });
          return wrapper.find(Button).filter({ onClick: onCancelEditClick });
        }

        test('is rendered if isEditing is true', () => {
          expect(getEditButton({ isEditing: true })).toHaveLength(1);
        });

        test('is not rendered if isEditing is false', () => {
          expect(getEditButton({ isEditing: false })).toHaveLength(0);
        });
      });

      describe('save button', () => {
        function getSaveButton(props) {
          const defaults = {
            isAdmin: true,
            reservationIsEditable: true,
          };
          const wrapper = getFormControls({ ...defaults, ...props });
          return wrapper.find(Button).filter({ type: 'submit' });
        }

        test('is rendered if isEditing is true', () => {
          expect(getSaveButton({ isEditing: true })).toHaveLength(1);
        });

        test('is not rendered if isEditing is false', () => {
          expect(getSaveButton({ isEditing: false })).toHaveLength(0);
        });
      });
    });
  });
});
