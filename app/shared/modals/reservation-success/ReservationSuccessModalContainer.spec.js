import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import CompactReservationList from 'shared/compact-reservation-list';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import {
  UnconnectedReservationSuccessModalContainer as ReservationSuccessModalContainer,
} from './ReservationSuccessModalContainer';

describe('shared/modals/reservation-success/ReservationSuccessModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    actions: {
      closeReservationSuccessModal: simple.stub(),
    },
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationSuccessModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    const wrapper = getWrapper();

    it('renders a Modal component', () => {
      const modalComponent = wrapper.find(Modal);

      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      const modalHeader = wrapper.find(Modal.Header);

      it('renders a ModalHeader component', () => {
        expect(modalHeader.length).to.equal(1);
      });

      it('contains a close button', () => {
        expect(modalHeader.props().closeButton).to.equal(true);
      });

      it('renders a ModalTitle component', () => {
        const modalTitle = wrapper.find(Modal.Title);

        expect(modalTitle.length).to.equal(1);
      });

      it('the ModalTitle displays text "Varauspyyntösi on lähetetty"', () => {
        const modalTitle = wrapper.find(Modal.Title);

        expect(modalTitle.props().children).to.equal('Varauspyyntösi on lähetetty');
      });
    });

    describe('Modal body', () => {
      const modalBody = wrapper.find(Modal.Body);

      it('renders a ModalBody component', () => {
        expect(modalBody.length).to.equal(1);
      });

      describe('reservation list', () => {
        it('renders a CompactReservationList component', () => {
          const list = modalBody.find(CompactReservationList);
          expect(list.length).to.equal(1);
        });

        it('passes correct props to CompactReservationList component', () => {
          const list = modalBody.find(CompactReservationList);
          expect(list.props().reservations).to.deep.equal(defaultProps.reservationsToShow);
          expect(list.props().resources).to.equal(undefined);
        });
      });
    });

    describe('Modal footer', () => {
      const modalFooter = wrapper.find(Modal.Footer);

      it('renders a ModalFooter component', () => {
        expect(modalFooter.length).to.equal(1);
      });

      describe('Footer buttons', () => {
        const buttons = modalFooter.find(Button);

        it('renders one Button', () => {
          expect(buttons.length).to.equal(1);
        });

        describe('the button', () => {
          const button = buttons.at(0);

          it('has text "Takaisin"', () => {
            expect(button.props().children).to.equal('Takaisin');
          });

          it('clicking it calls closeReservationSuccessModal', () => {
            defaultProps.actions.closeReservationSuccessModal.reset();
            button.props().onClick();

            expect(defaultProps.actions.closeReservationSuccessModal.callCount).to.equal(1);
          });
        });
      });
    });
  });
});
