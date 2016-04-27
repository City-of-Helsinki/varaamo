import { expect } from 'chai';
import { shallow } from 'enzyme';
import queryString from 'query-string';
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
      putReservation: simple.stub(),
      selectReservationToEdit: simple.stub(),
      updatePath: simple.stub(),
    },
    isEditingReservations: false,
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
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

        it('should render three Button', () => {
          expect(buttons.length).to.equal(3);
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

        describe('Edit button', () => {
          const button = buttons.at(1);

          it('the second button should read "Muokkaa"', () => {
            expect(button.props().children).to.equal('Muokkaa');
          });

          it('should have handleEdit as its onClick prop', () => {
            const instance = wrapper.instance();
            expect(button.props().onClick).to.equal(instance.handleEdit);
          });
        });

        describe('Save button', () => {
          const button = buttons.at(2);

          it('the third button should read "Tallenna"', () => {
            expect(button.props().children).to.equal('Tallenna');
          });

          it('should have handleSave as its onClick prop', () => {
            const instance = wrapper.instance();
            expect(button.props().onClick).to.equal(instance.handleSave);
          });
        });
      });
    });
  });

  describe('handleEdit', () => {
    before(() => {
      const instance = getWrapper().instance();
      defaultProps.actions.closeReservationInfoModal.reset();
      defaultProps.actions.selectReservationToEdit.reset();
      defaultProps.actions.updatePath.reset();
      instance.handleEdit();
    });

    it('should call selectReservationToEdit with reservation and minPeriod', () => {
      expect(defaultProps.actions.selectReservationToEdit.callCount).to.equal(1);
      expect(
        defaultProps.actions.selectReservationToEdit.lastCall.args[0]
      ).to.deep.equal(
        { reservation: reservation, minPeriod: resource.minPeriod }
      );
    });

    it('should call the updatePath with correct url', () => {
      const actualUrlArg = defaultProps.actions.updatePath.lastCall.args[0];
      const query = queryString.stringify({
        date: reservation.begin.split('T')[0],
        time: reservation.begin,
      });
      const expectedUrl = `/resources/${reservation.resource}/reservation?${query}`;

      expect(defaultProps.actions.updatePath.callCount).to.equal(1);
      expect(actualUrlArg).to.equal(expectedUrl);
    });

    it('should close the ReservationInfoModal', () => {
      expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
    });
  });

  describe('handleSave', () => {
    let updatedComments;

    before(() => {
      updatedComments = 'Updated comments';
      const instance = getWrapper().instance();
      instance.refs = {
        commentsInput: { getValue: () => updatedComments },
      };
      defaultProps.actions.closeReservationInfoModal.reset();
      defaultProps.actions.putReservation.reset();
      instance.handleSave();
    });

    it('should call putReservation for the first reservation in reservationsToShow', () => {
      expect(defaultProps.actions.putReservation.callCount).to.equal(1);
    });

    it('should call putReservation with correct arguments', () => {
      const actualArgs = defaultProps.actions.putReservation.lastCall.args;
      const expected = Object.assign({}, reservation, { comments: updatedComments });

      expect(actualArgs[0]).to.deep.equal(expected);
    });

    it('should close the ReservationInfoModal', () => {
      expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
    });
  });
});
