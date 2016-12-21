import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import CompactReservationList from 'shared/compact-reservation-list';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedReservationCancelModalContainer as ReservationCancelModalContainer,
} from './ReservationCancelModalContainer';

describe('shared/modals/reservation-cancel/ReservationCancelModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    actions: {
      closeReservationCancelModal: () => null,
      deleteReservation: () => null,
    },
    cancelAllowed: false,
    isCancellingReservations: false,
    reservation,
    resource,
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationCancelModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
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
        it('is correct if cancel is allowed', () => {
          const modalTitle = getModalHeaderWrapper({ cancelAllowed: true }).find(Modal.Title);
          expect(modalTitle.length).to.equal(1);
          expect(modalTitle.prop('children')).to.equal('ReservationCancelModal.cancelAllowedTitle');
        });

        it('is correct if cancel is not allowed', () => {
          const modalTitle = getModalHeaderWrapper({ cancelAllowed: false }).find(Modal.Title);
          expect(modalTitle.length).to.equal(1);
          expect(modalTitle.prop('children')).to.equal('ReservationCancelModal.cancelNotAllowedTitle');
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

      describe('if cancel is allowed', () => {
        const cancelAllowed = true;

        it('renders CompactReservationList', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find(CompactReservationList)
          ).to.have.length(1);
        });

        it('does not render responsibleContactInfo', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find('.responsible-contact-info')
          ).to.have.length(0);
        });
      });

      describe('if cancel is not allowed', () => {
        const cancelAllowed = false;

        it('renders responsibleContactInfo', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find('.responsible-contact-info')
          ).to.have.length(1);
        });

        it('does not render CompactReservationList', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find(CompactReservationList)
          ).to.have.length(0);
        });
      });
    });

    describe('Footer buttons', () => {
      function getFooterButtonsWrapper(props) {
        return getWrapper(props).find(Modal.Footer).find(Button);
      }

      describe('if cancel is allowed', () => {
        const cancelAllowed = true;
        const buttons = getFooterButtonsWrapper({ cancelAllowed });

        it('renders cancel button', () => {
          expect(buttons.at(0).props().children).to.equal('ReservationCancelModal.cancelAllowedCancel');
        });

        it('renders confirm button', () => {
          expect(buttons.at(1).props().children).to.equal('ReservationCancelModal.cancelAllowedConfirm');
        });
      });

      describe('if cancel is not allowed', () => {
        const cancelAllowed = false;
        const buttons = getFooterButtonsWrapper({ cancelAllowed });

        it('renders back button', () => {
          expect(buttons.at(0).props().children).to.equal('common.back');
        });
      });
    });
  });

  describe('handleCancel', () => {
    const closeReservationCancelModal = simple.mock();
    const deleteReservation = simple.mock();
    const actions = { closeReservationCancelModal, deleteReservation };

    before(() => {
      const instance = getWrapper({ actions }).instance();
      instance.handleCancel();
    });

    it('calls deleteReservation with the reservation', () => {
      expect(deleteReservation.callCount).to.equal(1);
      expect(deleteReservation.lastCall.arg).to.deep.equal(defaultProps.reservation);
    });

    it('closes the ReservationCancelModal', () => {
      expect(closeReservationCancelModal.callCount).to.equal(1);
    });
  });
});
