import { expect } from 'chai';
import forEach from 'lodash/forEach';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
import CompactReservationList from 'shared/compact-reservation-list';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ConfirmReservationModal from './ConfirmReservationModal';
import ReservationForm from './ReservationForm';

describe('pages/resource/reservation-confirmation/ConfirmReservationModal', () => {
  const defaultProps = {
    isAdmin: false,
    isEditing: false,
    isMakingReservations: false,
    isPreliminaryReservation: false,
    isStaff: false,
    onClose: simple.stub(),
    onConfirm: simple.stub(),
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
          const list = getModalBodyWrapper(props).find(CompactReservationList);
          expect(list).to.have.length(1);
          expect(list.prop('reservations')).to.deep.equal(defaultProps.selectedReservations);
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
      });
    });
  });

  describe('ReservationForm', () => {
    const termsAndConditions = 'Some terms and conditions';
    function getForm(needManualConfirmation = false, isAdmin = false, isStaff = false) {
      const resource = Resource.build({
        genericTerms: termsAndConditions,
        needManualConfirmation,
        userPermissions: { isAdmin },
      });
      const props = { isAdmin, isStaff, resource };
      return getWrapper(props).find(ReservationForm);
    }

    describe('if resource needs manual confirmation', () => {
      const needManualConfirmation = true;
      describe('if user is admin and staff', () => {
        const isAdmin = true;
        const isStaff = true;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields include staffEvent', () => {
          expect(formFields).to.contain('staffEvent');
        });

        it('form fields include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });
      });

      describe('if user is an admin', () => {
        const isAdmin = true;
        const isStaff = false;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });

        it('form fields does not include termsAndConditions', () => {
          expect(formFields).to.not.contain('termsAndConditions');
        });

        it('form termsAndConditions is an empty string', () => {
          expect(form.prop('termsAndConditions')).to.equal('');
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const isStaff = false;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields do not include comments', () => {
          expect(formFields).to.not.contain('comments');
        });

        it('form fields include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });

        it('form fields include termsAndConditions', () => {
          expect(formFields).to.contain('termsAndConditions');
        });

        it('form props contain termsAndConditions', () => {
          expect(form.prop('termsAndConditions')).to.equal(termsAndConditions);
        });
      });
    });

    describe('if resource does not need manual confirmation', () => {
      const needManualConfirmation = false;
      describe('if user is an admin', () => {
        const isAdmin = true;
        const form = getForm(needManualConfirmation, isAdmin);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields do not include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.not.contain(field);
          });
        });

        it('form fields does not include termsAndConditions', () => {
          expect(formFields).to.not.contain('termsAndConditions');
        });

        it('form termsAndConditions is an empty string', () => {
          expect(form.prop('termsAndConditions')).to.equal('');
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const form = getForm(needManualConfirmation, isAdmin);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields do not include comments', () => {
          expect(formFields).to.not.contain('comments');
        });

        it('form fields do not include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.not.contain(field);
          });
        });

        it('form fields include termsAndConditions', () => {
          expect(formFields).to.contain('termsAndConditions');
        });

        it('form props contain termsAndConditions', () => {
          expect(form.prop('termsAndConditions')).to.equal(termsAndConditions);
        });
      });
    });
  });
});
