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
    userUnitRole: null,
    onCancelEditClick: () => null,
    onStartEditClick: () => null,
    reservation: Immutable(reservation),
    reservationIsEditable: false,
    resource: Immutable(resource),
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(
      <ReservationEditForm {...defaultProps} {...extraProps} />
    );
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
        test('is rendered if user is UNIT_ADMINISTRATOR, UNIT_MANAGER or UNIT_VIEWER', () => {
          expect(getData({ userUnitRole: 'UNIT_ADMINISTRATOR' })).toContain(
            reservation.reserverId
          );
          expect(getData({ userUnitRole: 'UNIT_MANAGER' })).toContain(
            reservation.reserverId
          );
          expect(getData({ userUnitRole: 'UNIT_VIEWER' })).toContain(
            reservation.reserverId
          );
        });

        test('is not rendered if user has some other role', () => {
          expect(getData({ userUnitRole: null })).not.toContain(
            reservation.reserverId
          );
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
          expect(getData({ reservation: userReservation })).toContain(
            user.displayName
          );
        });

        test('renders reservation user email when reserverEmailAddress is empty', () => {
          expect(getData({ reservation: userReservation })).toContain(
            user.email
          );
        });
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

        describe('ReservationTimeControls', () => {
          const getTimeTestingWrapper = (
            props,
            openHoursDate = '2017-07-07',
            reservationBegin = '2017-07-07T12:45'
          ) => {
            const resourceOpenHours = [
              {
                date: openHoursDate,
                opens: '2017-07-07T09:00',
                closes: '2017-07-07T16:00',
              },
            ];
            const resource0 = { ...resource, openingHours: resourceOpenHours };
            const reservation0 = { ...reservation, begin: reservationBegin };

            return getWrapper({
              resource: resource0,
              reservation: reservation0,
              ...props,
            });
          };
          const findTimeControls = (wrapper) =>
            wrapper.find(Fields).filter({ names: ['begin', 'end'] });

          test('renders ReservationTimeControls', () => {
            const timeControls = findTimeControls(
              getWrapper({ isEditing: true })
            );
            expect(timeControls).toHaveLength(1);
          });

          describe('when user has role UNIT_VIEWER', () => {
            test('time options are constrained to resource.openingHours on reservation.begin date', () => {
              const timeControlProps = findTimeControls(
                getTimeTestingWrapper({
                  isEditing: true,
                  userUnitRole: 'UNIT_VIEWER',
                })
              ).props();

              expect(timeControlProps.constraints.startTime).toEqual('09:00');
              expect(timeControlProps.constraints.endTime).toEqual('16:00');
            });

            test('time controls are disabled if no opening hours are found', () => {
              const timeControlProps = findTimeControls(
                getTimeTestingWrapper(
                  {
                    isEditing: true,
                    userUnitRole: 'UNIT_VIEWER',
                  },
                  undefined,
                  '2017-07-08T12:45'
                )
              ).props();

              expect(timeControlProps.disabled).toEqual(true);
            });
          });

          test('renders refund policy for correct roles', () => {
            // Should only be rendered for admin level users, should
            // only be rendered for reservations that are not made by
            // staff and should only be rendered when the price is
            // greater than 0.
            const getRefundPolicy = (wrapper) => {
              return wrapper.find({ id: 'refund-policy' });
            };
            const notAdmin = getWrapper({ isEditing: true, isAdmin: false });
            const admin = getWrapper({
              isEditing: true,
              isAdmin: true,
              reservation: {
                ...reservation,
                isStaffEvent: false,
                begin: new Date(2017, 10, 1, 9, 0, 0, 0).toJSON(),
                end: new Date(2017, 10, 1, 11, 0, 0, 0).toJSON(),
              },
              resource: {
                ...resource,
                products: [
                  {
                    price: {
                      type: 'per_period',
                      period: '01:00',
                      amount: 100,
                    },
                  },
                ],
              },
            });

            expect(getRefundPolicy(notAdmin).length).toEqual(0);
            expect(getRefundPolicy(admin).length).toEqual(1);
          });
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

        test('disabled when the resource has a cost and the user is not an admin', () => {
          const isAdmin = getEditButton({
            isEditing: false,
            isAdmin: true,
            resource: {
              ...resource,
              products: [
                {
                  price: {},
                },
              ],
            },
          });
          const isUser = getEditButton({
            isEditing: false,
            isAdmin: false,
            reservation: {
              ...reservation,
              isOwn: true,
            },
            resource: {
              ...resource,
              products: [
                {
                  price: {},
                },
              ],
            },
          });

          expect(isAdmin.prop('disabled')).toEqual(false);
          expect(isUser.prop('disabled')).toEqual(true);
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
