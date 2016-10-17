import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ReactDom from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import ReservationStateLabel from 'shared/reservation-state-label';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { makeButtonTests } from 'utils/testUtils';
import {
  UnconnectedReservationInfoModalContainer as ReservationInfoModalContainer,
} from './ReservationInfoModalContainer';

describe('shared/modals/reservation-info/ReservationInfoModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({
    billingAddressCity: 'New York',
    billingAddressStreet: 'Billing Street 11',
    billingAddressZip: '99999',
    reserverId: '112233-123A',
    comments: 'Just some comments.',
    eventDescription: 'Jedi mind tricks',
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
    actions: {
      closeReservationInfoModal: simple.stub(),
      commentReservation: simple.stub(),
    },
    isAdmin: true,
    isEditingReservations: false,
    reservation: Immutable(reservation),
    resource: Immutable(resource),
    show: true,
    staffUnits: [],
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationInfoModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);

      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      const modalHeader = getWrapper().find(Modal.Header);

      it('renders a ModalHeader component', () => {
        expect(modalHeader.length).to.equal(1);
      });

      it('contains a close button', () => {
        expect(modalHeader.props().closeButton).to.equal(true);
      });

      it('renders a ModalTitle component', () => {
        const modalTitle = getWrapper().find(Modal.Title);

        expect(modalTitle.length).to.equal(1);
      });

      it('the ModalTitle displays text "Varauksen tiedot"', () => {
        const modalTitle = getWrapper().find(Modal.Title);

        expect(modalTitle.props().children).to.equal('Varauksen tiedot');
      });
    });

    describe('Modal body', () => {
      const modalBody = getWrapper().find(Modal.Body);

      it('renders a ModalBody component', () => {
        expect(modalBody.length).to.equal(1);
      });

      it('renders ReservationStateLabel component', () => {
        const reservationStateLabel = getWrapper().find(ReservationStateLabel);
        expect(reservationStateLabel.length).to.equal(1);
      });

      describe('reservation data', () => {
        const dl = getWrapper().find('dl');
        const dlText = dl.text();

        it('renders a definition list', () => {
          expect(dl.length).to.equal(1);
        });

        it('renders reservation.billingAddressCity', () => {
          expect(dlText).to.contain(reservation.billingAddressCity);
        });

        it('renders reservation.billingAddressStreet', () => {
          expect(dlText).to.contain(reservation.billingAddressStreet);
        });

        it('renders reservation.billingAddressZip', () => {
          expect(dlText).to.contain(reservation.billingAddressZip);
        });

        describe('reserverId', () => {
          describe('if user has staff rights', () => {
            it('renders reservation.reserverId', () => {
              const wrapper = getWrapper({ staffUnits: [resource.unit] });
              expect(wrapper.find('dl').text()).to.contain(reservation.reserverId);
            });
          });

          describe('if user does not have staff rights', () => {
            it('does not render reservation.reserverId', () => {
              const wrapper = getWrapper({ staffUnits: [] });
              expect(wrapper.find('dl').text()).to.not.contain(reservation.reserverId);
            });
          });
        });

        it('renders reservation.eventDescription', () => {
          expect(dlText).to.contain(reservation.eventDescription);
        });

        it('renders reservation.numberOfParticipants', () => {
          expect(dlText).to.contain(reservation.numberOfParticipants);
        });

        it('renders reservation.reserverAddressCity', () => {
          expect(dlText).to.contain(reservation.reserverAddressCity);
        });

        it('renders reservation.reserverAddressStreet', () => {
          expect(dlText).to.contain(reservation.reserverAddressStreet);
        });

        it('renders reservation.reserverAddressZip', () => {
          expect(dlText).to.contain(reservation.reserverAddressZip);
        });

        it('renders reservation.reserverEmailAddress', () => {
          expect(dlText).to.contain(reservation.reserverEmailAddress);
        });

        it('renders reservation.reserverName', () => {
          expect(dlText).to.contain(reservation.reserverName);
        });

        it('renders reservation.reserverPhoneNumber', () => {
          expect(dlText).to.contain(reservation.reserverPhoneNumber);
        });

        it('does not render reservation.comments', () => {
          expect(dlText).to.not.contain(reservation.comments);
        });
      });

      describe('comments', () => {
        describe('if user has admin rights', () => {
          const isAdmin = true;

          describe('if reservation state is cancelled', () => {
            const cancelledReservation = Object.assign({}, reservation, { state: 'cancelled' });
            let wrapper;

            before(() => {
              wrapper = getWrapper({
                isAdmin,
                reservation: cancelledReservation,
              });
            });

            it('renders reservation comments as text', () => {
              const reservationTexts = wrapper.find('dl').text();
              expect(reservationTexts).to.contain(cancelledReservation.comments);
            });

            it('does not render FormControl for comments', () => {
              const formControl = wrapper.find(FormControl);
              expect(formControl.length).to.equal(0);
            });
          });

          describe('if reservation state is not cancelled', () => {
            const confirmedReservation = Object.assign({}, reservation, { state: 'confirmed' });
            let formControl;

            before(() => {
              const wrapper = getWrapper({
                isAdmin,
                reservation: confirmedReservation,
              });
              formControl = wrapper.find(FormControl);
            });

            it('renders textarea FormControl for comments', () => {
              expect(formControl.length).to.equal(1);
              expect(formControl.props().componentClass).to.equal('textarea');
            });

            it('the FormControl has reservation.comments as default value', () => {
              expect(formControl.props().defaultValue).to.equal(reservation.comments);
            });

            it('does not render reservation comments as text', () => {
              const reservationTexts = getWrapper().find('dl').text();
              expect(reservationTexts).to.not.contain(confirmedReservation.comments);
            });
          });
        });

        describe('if user does not have admin rights', () => {
          const isAdmin = false;
          let wrapper;

          before(() => {
            wrapper = getWrapper({ isAdmin });
          });

          it('does not render FormControl for comments', () => {
            const formControl = wrapper.find(FormControl);
            expect(formControl.length).to.equal(0);
          });

          it('does not render reservation comments as text', () => {
            const reservationTexts = getWrapper().find('dl').text();
            expect(reservationTexts).to.not.contain(reservation.comments);
          });
        });
      });
    });

    describe('Footer buttons', () => {
      describe('if user has admin permissions', () => {
        const isAdmin = true;
        const wrapper = getWrapper({ isAdmin });
        const modalFooter = wrapper.find(Modal.Footer);
        const buttons = modalFooter.find(Button);

        it('renders two buttons', () => {
          expect(buttons.length).to.equal(2);
        });

        describe('the first button', () => {
          makeButtonTests(
            buttons.at(0),
            'back',
            'Takaisin',
            defaultProps.actions.closeReservationInfoModal
          );
        });

        describe('the second button', () => {
          const button = buttons.at(1);

          it('is save button', () => {
            expect(button.props().children).to.equal('Tallenna');
          });

          it('has handleSave as its onClick prop', () => {
            const instance = wrapper.instance();
            expect(button.props().onClick).to.equal(instance.handleSave);
          });
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const wrapper = getWrapper({ isAdmin });
        const modalFooter = wrapper.find(Modal.Footer);
        const buttons = modalFooter.find(Button);

        it('renders one button', () => {
          expect(buttons.length).to.equal(1);
        });

        describe('the button', () => {
          makeButtonTests(
            buttons.at(0),
            'back',
            'Takaisin',
            defaultProps.actions.closeReservationInfoModal
          );
        });
      });
    });
  });

  describe('handleSave', () => {
    let updatedComments;

    before(() => {
      updatedComments = 'Updated comments';
      simple.mock(ReactDom, 'findDOMNode').returnWith({ value: updatedComments });
      const instance = getWrapper().instance();
      defaultProps.actions.closeReservationInfoModal.reset();
      defaultProps.actions.commentReservation.reset();
      instance.handleSave();
    });

    after(() => {
      simple.restore();
    });

    it('calls commentReservation', () => {
      expect(defaultProps.actions.commentReservation.callCount).to.equal(1);
    });

    it('calls commentReservation with correct arguments', () => {
      const actualArgs = defaultProps.actions.commentReservation.lastCall.args;

      expect(actualArgs[0]).to.deep.equal(reservation);
      expect(actualArgs[1]).to.deep.equal(resource);
      expect(actualArgs[2]).to.deep.equal(updatedComments);
    });

    it('closes the ReservationInfoModal', () => {
      expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
    });
  });
});
