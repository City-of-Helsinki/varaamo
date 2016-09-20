import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ReactDom from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import {
  UnconnectedReservationInfoModal as ReservationInfoModal,
} from 'containers/ReservationInfoModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import { makeButtonTests } from 'utils/testUtils';

describe('Container: ReservationInfoModal', () => {
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
      putReservation: simple.stub(),
    },
    isEditingReservations: false,
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
    staffUnits: [],
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationInfoModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('should render a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);

      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      const modalHeader = getWrapper().find(Modal.Header);

      it('should render a ModalHeader component', () => {
        expect(modalHeader.length).to.equal(1);
      });

      it('should contain a close button', () => {
        expect(modalHeader.props().closeButton).to.equal(true);
      });

      it('should render a ModalTitle component', () => {
        const modalTitle = getWrapper().find(Modal.Title);

        expect(modalTitle.length).to.equal(1);
      });

      it('the ModalTitle should display text "Varauksen tiedot"', () => {
        const modalTitle = getWrapper().find(Modal.Title);

        expect(modalTitle.props().children).to.equal('Varauksen tiedot');
      });
    });

    describe('Modal body', () => {
      const modalBody = getWrapper().find(Modal.Body);

      it('should render a ModalBody component', () => {
        expect(modalBody.length).to.equal(1);
      });

      describe('reservation data', () => {
        const dl = getWrapper().find('dl');
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

        describe('reserverId', () => {
          describe('if user has staff rights', () => {
            it('should render reservation.reserverId', () => {
              const wrapper = getWrapper({ staffUnits: [resource.unit] });
              expect(wrapper.find('dl').text()).to.contain(reservation.reserverId);
            });
          });

          describe('if user does not have staff rights', () => {
            it('should not render reservation.reserverId', () => {
              const wrapper = getWrapper({ staffUnits: [] });
              expect(wrapper.find('dl').text()).to.not.contain(reservation.reserverId);
            });
          });
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

      describe('comments', () => {
        describe('if user has admin rights', () => {
          const resourceWithAdminRights = Object.assign({}, resource, {
            userPermissions: { isAdmin: true },
          });

          describe('if reservation state is cancelled', () => {
            const cancelledReservation = Object.assign({}, reservation, { state: 'cancelled' });
            let wrapper;

            before(() => {
              wrapper = getWrapper({
                resources: { [resourceWithAdminRights.id]: resourceWithAdminRights },
                reservationsToShow: [cancelledReservation],
              });
            });

            it('should render reservation comments as text', () => {
              const reservationTexts = wrapper.find('dl').text();
              expect(reservationTexts).to.contain(cancelledReservation.comments);
            });

            it('should not render FormControl for comments', () => {
              const formControl = wrapper.find(FormControl);
              expect(formControl.length).to.equal(0);
            });
          });

          describe('if reservation state is not cancelled', () => {
            const confirmedReservation = Object.assign({}, reservation, { state: 'confirmed' });
            let formControl;

            before(() => {
              const wrapper = getWrapper({
                resources: { [resourceWithAdminRights.id]: resourceWithAdminRights },
                reservationsToShow: [confirmedReservation],
              });
              formControl = wrapper.find(FormControl);
            });

            it('should render textarea FormControl for comments', () => {
              expect(formControl.length).to.equal(1);
              expect(formControl.props().componentClass).to.equal('textarea');
            });

            it('the FormControl should have reservation.comments as default value', () => {
              expect(formControl.props().defaultValue).to.equal(reservation.comments);
            });

            it('should not render reservation comments as text', () => {
              const reservationTexts = getWrapper().find('dl').text();
              expect(reservationTexts).to.not.contain(confirmedReservation.comments);
            });
          });
        });

        describe('if user does not have admin rights', () => {
          const resourceWithoutAdminRights = Object.assign({}, resource, {
            userPermissions: { isAdmin: false },
          });
          let wrapper;

          before(() => {
            wrapper = getWrapper({
              resources: { [resourceWithoutAdminRights.id]: resourceWithoutAdminRights },
            });
          });

          it('should not render FormControl for comments', () => {
            const formControl = wrapper.find(FormControl);
            expect(formControl.length).to.equal(0);
          });

          it('should not render reservation comments as text', () => {
            const reservationTexts = getWrapper().find('dl').text();
            expect(reservationTexts).to.not.contain(resourceWithoutAdminRights.comments);
          });
        });
      });
    });

    describe('Footer buttons', () => {
      describe('if user has admin permissions', () => {
        const wrapper = getWrapper({
          reservationsToShow: [Reservation.build({ resource: resource.id })],
          resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: true } }) },
        });
        const modalFooter = wrapper.find(Modal.Footer);
        const buttons = modalFooter.find(Button);

        it('should render two buttons', () => {
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

          it('should be save button', () => {
            expect(button.props().children).to.equal('Tallenna');
          });

          it('should have handleSave as its onClick prop', () => {
            const instance = wrapper.instance();
            expect(button.props().onClick).to.equal(instance.handleSave);
          });
        });
      });

      describe('if user is a regular user', () => {
        const wrapper = getWrapper({
          resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: false } }) },
        });
        const modalFooter = wrapper.find(Modal.Footer);
        const buttons = modalFooter.find(Button);

        it('should render one button', () => {
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
      defaultProps.actions.putReservation.reset();
      instance.handleSave();
    });

    after(() => {
      simple.restore();
    });

    it('should call putReservation for the first reservation in reservationsToShow', () => {
      expect(defaultProps.actions.putReservation.callCount).to.equal(1);
    });

    it('should call putReservation with correct arguments', () => {
      const actualArgs = defaultProps.actions.putReservation.lastCall.args;
      const expected = Object.assign({}, reservation, {
        comments: updatedComments,
        staffEvent: false,
      });

      expect(actualArgs[0]).to.deep.equal(expected);
    });

    it('should close the ReservationInfoModal', () => {
      expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
    });
  });
});
