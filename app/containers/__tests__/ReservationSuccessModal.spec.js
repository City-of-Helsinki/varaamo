import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import CompactReservationsList from 'components/common/CompactReservationsList';

import {
  UnconnectedReservationSuccessModal as ReservationSuccessModal,
} from 'containers/ReservationSuccessModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

describe('Container: ReservationSuccessModal', () => {
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
    return shallow(<ReservationSuccessModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    const wrapper = getWrapper();

    it('should render a Modal component', () => {
      const modalComponent = wrapper.find(Modal);

      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      const modalHeader = wrapper.find(Modal.Header);

      it('should render a ModalHeader component', () => {
        expect(modalHeader.length).to.equal(1);
      });

      it('should contain a close button', () => {
        expect(modalHeader.props().closeButton).to.equal(true);
      });

      it('should render a ModalTitle component', () => {
        const modalTitle = wrapper.find(Modal.Title);

        expect(modalTitle.length).to.equal(1);
      });

      it('the ModalTitle should display text "Varauspyyntösi on lähetetty"', () => {
        const modalTitle = wrapper.find(Modal.Title);

        expect(modalTitle.props().children).to.equal('Varauspyyntösi on lähetetty');
      });
    });

    describe('Modal body', () => {
      const modalBody = wrapper.find(Modal.Body);

      it('should render a ModalBody component', () => {
        expect(modalBody.length).to.equal(1);
      });

      describe('reservation list', () => {
        it('should render a CompactReservationsList component', () => {
          const list = modalBody.find(CompactReservationsList);
          expect(list.length).to.equal(1);
        });

        it('should pass correct props to CompactReservationsList component', () => {
          const list = modalBody.find(CompactReservationsList);
          expect(list.props().reservations).to.deep.equal(defaultProps.reservationsToShow);
          expect(list.props().resources).to.equal(undefined);
        });
      });
    });

    describe('Modal footer', () => {
      const modalFooter = wrapper.find(Modal.Footer);

      it('should render a ModalFooter component', () => {
        expect(modalFooter.length).to.equal(1);
      });

      describe('Footer buttons', () => {
        const buttons = modalFooter.find(Button);

        it('should render one Button', () => {
          expect(buttons.length).to.equal(1);
        });

        describe('the button', () => {
          const button = buttons.at(0);

          it('should read "Takaisin"', () => {
            expect(button.props().children).to.equal('Takaisin');
          });

          it('clicking it should call closeReservationSuccessModal', () => {
            defaultProps.actions.closeReservationSuccessModal.reset();
            button.props().onClick();

            expect(defaultProps.actions.closeReservationSuccessModal.callCount).to.equal(1);
          });
        });
      });
    });
  });
});
