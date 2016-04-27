import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import {
  UnconnectedReservationInfoModal as ReservationInfoModal,
} from 'containers/ReservationInfoModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

describe('Container: ReservationInfoModal', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({
    billingAddressCity: 'New York',
    billingAddressStreet: 'Billing Street 11',
    billingAddressZip: '99999',
    businessId: '1234567',
    comments: 'Just some comments.',
    company: 'Rebellion',
    eventDescription: 'Jedi mind tricks',
    numberOfParticipants: 12,
    reserverAddressCity: 'Mos Eisley',
    reserverAddressStreet: 'Cantina street 3B',
    reserverAddressZip: '12345',
    reserverEmailAddress: 'luke@sky.com',
    reserverName: 'Luke Skywalker',
    reserverPhoneNumber: '1234567',
  });
  const defaultProps = {
    actions: {
      closeReservationInfoModal: simple.stub(),
    },
    show: true,
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationInfoModal {...defaultProps} {...extraProps} />);
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

      it('the ModalTitle should display text "Varauksen tiedot"', () => {
        const modalTitle = wrapper.find(Modal.Title);

        expect(modalTitle.props().children).to.equal('Varauksen tiedot');
      });
    });

    describe('Modal body', () => {
      const modalBody = wrapper.find(Modal.Body);

      it('should render a ModalBody component', () => {
        expect(modalBody.length).to.equal(1);
      });

      describe('reservation data', () => {
        const dl = wrapper.find('dl');
        const dlText = dl.text();

        it('should render a definition list', () => {
          expect(dl.length).to.equal(1);
        });

        it('should render reservation.billingAddressCity', () => {
          expect(dlText).to.contain(reservation.billingAddressCity);
        });

        it('should render reservation.billingAddressStreet', () => {
          expect(dlText).to.contain(reservation.billingAddressStreet);
        });

        it('should render reservation.billingAddressZip', () => {
          expect(dlText).to.contain(reservation.billingAddressZip);
        });

        it('should render reservation.businessId', () => {
          expect(dlText).to.contain(reservation.businessId);
        });

        it('should render reservation.company', () => {
          expect(dlText).to.contain(reservation.company);
        });

        it('should render reservation.eventDescription', () => {
          expect(dlText).to.contain(reservation.eventDescription);
        });

        it('should render reservation.numberOfParticipants', () => {
          expect(dlText).to.contain(reservation.numberOfParticipants);
        });

        it('should render reservation.reserverAddressCity', () => {
          expect(dlText).to.contain(reservation.reserverAddressCity);
        });

        it('should render reservation.reserverAddressStreet', () => {
          expect(dlText).to.contain(reservation.reserverAddressStreet);
        });

        it('should render reservation.reserverAddressZip', () => {
          expect(dlText).to.contain(reservation.reserverAddressZip);
        });

        it('should render reservation.reserverEmailAddress', () => {
          expect(dlText).to.contain(reservation.reserverEmailAddress);
        });

        it('should render reservation.reserverName', () => {
          expect(dlText).to.contain(reservation.reserverName);
        });

        it('should render reservation.reserverPhoneNumber', () => {
          expect(dlText).to.contain(reservation.reserverPhoneNumber);
        });

        it('should not render reservation.comments', () => {
          expect(dlText).to.not.contain(reservation.comments);
        });
      });

      describe('comments input', () => {
        const input = wrapper.find(Input);
        it('should render textarea input for comments', () => {
          expect(input.length).to.equal(1);
          expect(input.props().type).to.equal('textarea');
        });

        it('should have reservation.comments as default value', () => {
          expect(input.props().defaultValue).to.equal(reservation.comments);
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

        describe('Cancel button', () => {
          const button = buttons.at(0);

          it('the first button should read "Takaisin"', () => {
            expect(button.props().children).to.equal('Takaisin');
          });

          it('clicking it should call closeReservationInfoModal', () => {
            defaultProps.actions.closeReservationInfoModal.reset();
            button.props().onClick();

            expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
          });
        });
      });
    });
  });
});
