import forEach from 'lodash/forEach';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import CompactReservationList from 'shared/compact-reservation-list';
import RecurringReservationControls from 'shared/recurring-reservation-controls';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ConfirmReservationModal from './ConfirmReservationModal';
import ReservationForm from './ReservationForm';

describe('shared/reservation-confirmation/ConfirmReservationModal', () => {
  const defaultProps = {
    isAdmin: false,
    isEditing: false,
    isMakingReservations: false,
    isPreliminaryReservation: false,
    isStaff: false,
    onCancel: simple.stub(),
    onClose: simple.stub(),
    onConfirm: simple.stub(),
    onRemoveReservation: simple.stub(),
    recurringReservations: [],
    reservationsToEdit: Immutable([]),
    resource: Resource.build(),
    selectedReservations: Immutable([
      Reservation.build(),
      Reservation.build(),
    ]),
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ConfirmReservationModal {...defaultProps} {...extraProps} />);
  }

  describe('modal', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).toBe(1);
    });

    describe('Modal header', () => {
      function getModalHeaderWrapper(props) {
        return getWrapper(props).find(Modal.Header);
      }

      test('is rendered', () => {
        expect(getModalHeaderWrapper()).toHaveLength(1);
      });

      test('contains a close button', () => {
        expect(getModalHeaderWrapper().props().closeButton).toBe(true);
      });

      describe('title', () => {
        test('is correct if editing', () => {
          const modalTitle = getModalHeaderWrapper({ isEditing: true }).find(Modal.Title);
          expect(modalTitle.prop('children')).toBe('ConfirmReservationModal.editTitle');
        });

        test('is correct if confirming preliminary reservation', () => {
          const modalTitle = getModalHeaderWrapper({ isPreliminaryReservation: true })
            .find(Modal.Title);
          expect(modalTitle.prop('children')).toBe('ConfirmReservationModal.preliminaryReservationTitle');
        });

        test('is correct if confirming regular reservation', () => {
          const modalTitle = getModalHeaderWrapper({ isPreliminaryReservation: false })
            .find(Modal.Title);
          expect(modalTitle.prop('children')).toBe('ConfirmReservationModal.regularReservationTitle');
        });
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      test('is rendered', () => {
        expect(getModalBodyWrapper).toHaveLength(1);
      });

      test('renders ReservationForm', () => {
        expect(getModalBodyWrapper().find(ReservationForm)).toHaveLength(1);
      });

      describe('when making a preliminary reservation', () => {
        const props = {
          isPreliminaryReservation: true,
        };

        test('renders CompactReservationList with correct props', () => {
          const recurringReservations = [
            Reservation.build(),
            Reservation.build(),
          ];
          const list = getModalBodyWrapper({ ...props, recurringReservations })
            .find(CompactReservationList);
          expect(list).toHaveLength(1);
          expect(list.prop('reservations')).toEqual(defaultProps.selectedReservations);
          expect(list.prop('removableReservations')).toEqual(recurringReservations);
        });

        test('renders RecurringReservationControls if user is admin', () => {
          expect(
            getModalBodyWrapper({ ...props, isAdmin: true }).find(RecurringReservationControls)
          ).toHaveLength(1);
        });

        test(
          'does not render RecurringReservationControls if user is not admin',
          () => {
            expect(
              getModalBodyWrapper({ ...props, isAdmin: false }).find(RecurringReservationControls)
            ).toHaveLength(0);
          }
        );
      });

      describe('when editing reservation', () => {
        const props = {
          isEditing: true,
          reservationsToEdit: Immutable([Reservation.build()]),
        };

        test('renders one CompactReservationList with reservations to edit', () => {
          const list = getModalBodyWrapper(props).find(CompactReservationList).at(0);
          expect(list).toHaveLength(1);
          expect(list.prop('reservations')).toEqual(props.reservationsToEdit);
        });

        test(
          'renders one CompactReservationList with reservations selected reservations',
          () => {
            const list = getModalBodyWrapper(props).find(CompactReservationList).at(1);
            expect(list).toHaveLength(1);
            expect(list.prop('reservations')).toEqual(defaultProps.selectedReservations);
          }
        );

        test('does not render RecurringReservationControls', () => {
          expect(getModalBodyWrapper(props).find(RecurringReservationControls)).toHaveLength(0);
        });
      });
    });
  });

  describe('ReservationForm fields', () => {
    function getFormFields(props) {
      return getWrapper(props).find(ReservationForm).props().fields;
    }

    test('contain resource.supportedReservationExtraFields', () => {
      const supportedReservationExtraFields = ['firstField', 'secondField'];
      const resource = Resource.build({ supportedReservationExtraFields });
      forEach(supportedReservationExtraFields, (field) => {
        expect(getFormFields({ resource })).toEqual(expect.arrayContaining([field]));
      });
    });

    describe('comments', () => {
      test('is included if user is an admin', () => {
        expect(getFormFields({ isAdmin: true })).toEqual(expect.arrayContaining(['comments']));
      });

      test('is not included if user is not an admin', () => {
        expect(getFormFields({ isAdmin: false })).toEqual(expect.not.arrayContaining(['comments']));
      });
    });

    describe('staffEvent', () => {
      test('is not included if resource does not need manual confirmation', () => {
        const props = {
          isStaff: true,
          resource: Resource.build({ needManualConfirmation: false }),
        };
        expect(getFormFields(props)).toEqual(expect.not.arrayContaining(['staffEvent']));
      });

      test('is not included if user is not staff', () => {
        const props = {
          isStaff: false,
          resource: Resource.build({ needManualConfirmation: true }),
        };
        expect(getFormFields(props)).toEqual(expect.not.arrayContaining(['staffEvent']));
      });

      test(
        'is included if user is staff and resource need manual confirmation',
        () => {
          const props = {
            isStaff: true,
            resource: Resource.build({ needManualConfirmation: true }),
          };
          expect(getFormFields(props)).toEqual(expect.arrayContaining(['staffEvent']));
        }
      );
    });

    describe('termsAndConditions', () => {
      test('is included if resource contains terms', () => {
        const resource = Resource.build({ genericTerms: 'Some terms' });
        expect(getFormFields({ resource })).toEqual(expect.arrayContaining(['termsAndConditions']));
      });

      test('is not included if resource does not contain any terms', () => {
        const resource = Resource.build({ genericTerms: null });
        expect(getFormFields({ resource })).toEqual(expect.not.arrayContaining(['termsAndConditions']));
      });
    });
  });
});
