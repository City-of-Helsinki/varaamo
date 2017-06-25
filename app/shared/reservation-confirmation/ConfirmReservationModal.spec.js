import { expect } from 'chai';
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
    it('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      function getModalHeaderWrapper(props) {
        return getWrapper(props).find(Modal.Header);
      }

      it('is rendered', () => {
        expect(getModalHeaderWrapper()).to.have.length(1);
      });

      it('contains a close button', () => {
        expect(getModalHeaderWrapper().props().closeButton).to.equal(true);
      });

      describe('title', () => {
        it('is correct if editing', () => {
          const modalTitle = getModalHeaderWrapper({ isEditing: true }).find(Modal.Title);
          expect(modalTitle.prop('children')).to.equal('ConfirmReservationModal.editTitle');
        });

        it('is correct if confirming preliminary reservation', () => {
          const modalTitle = getModalHeaderWrapper({ isPreliminaryReservation: true })
            .find(Modal.Title);
          expect(modalTitle.prop('children')).to.equal(
            'ConfirmReservationModal.preliminaryReservationTitle'
          );
        });

        it('is correct if confirming regular reservation', () => {
          const modalTitle = getModalHeaderWrapper({ isPreliminaryReservation: false })
            .find(Modal.Title);
          expect(modalTitle.prop('children')).to.equal(
            'ConfirmReservationModal.regularReservationTitle'
          );
        });
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      it('is rendered', () => {
        expect(getModalBodyWrapper).to.have.length(1);
      });

      it('renders ReservationForm', () => {
        expect(getModalBodyWrapper().find(ReservationForm)).to.have.length(1);
      });

      describe('when making a preliminary reservation', () => {
        const props = {
          isPreliminaryReservation: true,
        };

        it('renders CompactReservationList with correct props', () => {
          const recurringReservations = [
            Reservation.build(),
            Reservation.build(),
          ];
          const list = getModalBodyWrapper({ ...props, recurringReservations })
            .find(CompactReservationList);
          expect(list).to.have.length(1);
          expect(list.prop('reservations')).to.deep.equal(defaultProps.selectedReservations);
          expect(list.prop('removableReservations')).to.deep.equal(recurringReservations);
        });

        it('renders RecurringReservationControls if user is admin', () => {
          expect(
            getModalBodyWrapper({ ...props, isAdmin: true }).find(RecurringReservationControls)
          ).to.have.length(1);
        });

        it('does not render RecurringReservationControls if user is not admin', () => {
          expect(
            getModalBodyWrapper({ ...props, isAdmin: false }).find(RecurringReservationControls)
          ).to.have.length(0);
        });
      });

      describe('when editing reservation', () => {
        const props = {
          isEditing: true,
          reservationsToEdit: Immutable([Reservation.build()]),
        };

        it('renders one CompactReservationList with reservations to edit', () => {
          const list = getModalBodyWrapper(props).find(CompactReservationList).at(0);
          expect(list).to.have.length(1);
          expect(list.prop('reservations')).to.deep.equal(props.reservationsToEdit);
        });

        it('renders one CompactReservationList with reservations selected reservations', () => {
          const list = getModalBodyWrapper(props).find(CompactReservationList).at(1);
          expect(list).to.have.length(1);
          expect(list.prop('reservations')).to.deep.equal(defaultProps.selectedReservations);
        });

        it('does not render RecurringReservationControls', () => {
          expect(getModalBodyWrapper(props).find(RecurringReservationControls)).to.have.length(0);
        });
      });
    });
  });

  describe('ReservationForm fields', () => {
    function getFormFields(props) {
      return getWrapper(props).find(ReservationForm).props().fields;
    }

    it('contain resource.supportedReservationExtraFields', () => {
      const supportedReservationExtraFields = ['firstField', 'secondField'];
      const resource = Resource.build({ supportedReservationExtraFields });
      forEach(supportedReservationExtraFields, (field) => {
        expect(getFormFields({ resource })).to.contain(field);
      });
    });

    describe('comments', () => {
      it('is included if user is an admin', () => {
        expect(getFormFields({ isAdmin: true })).to.contain('comments');
      });

      it('is not included if user is not an admin', () => {
        expect(getFormFields({ isAdmin: false })).to.not.contain('comments');
      });
    });

    describe('staffEvent', () => {
      it('is not included if resource does not need manual confirmation', () => {
        const props = {
          isStaff: true,
          resource: Resource.build({ needManualConfirmation: false }),
        };
        expect(getFormFields(props)).to.not.contain('staffEvent');
      });

      it('is not included if user is not staff', () => {
        const props = {
          isStaff: false,
          resource: Resource.build({ needManualConfirmation: true }),
        };
        expect(getFormFields(props)).to.not.contain('staffEvent');
      });

      it('is included if user is staff and resource need manual confirmation', () => {
        const props = {
          isStaff: true,
          resource: Resource.build({ needManualConfirmation: true }),
        };
        expect(getFormFields(props)).to.contain('staffEvent');
      });
    });

    describe('termsAndConditions', () => {
      it('is included if resource contains terms', () => {
        const resource = Resource.build({ genericTerms: 'Some terms' });
        expect(getFormFields({ resource })).to.contain('termsAndConditions');
      });

      it('is not included if resource does not contain any terms', () => {
        const resource = Resource.build({ genericTerms: null });
        expect(getFormFields({ resource })).to.not.contain('termsAndConditions');
      });
    });
  });
});
