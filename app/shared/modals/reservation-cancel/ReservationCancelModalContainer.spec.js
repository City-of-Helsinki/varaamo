import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import {
  UnconnectedReservationCancelModalContainer as ReservationCancelModalContainer,
} from './ReservationCancelModalContainer';

describe('shared/modals/reservation-cancel/ReservationCancelModalContainer', () => {
  const responsibleContactInfo = 'Some contact info.';
  const resource = Resource.build({ responsibleContactInfo });
  const props = {
    actions: {
      closeReservationCancelModal: simple.stub(),
      deleteReservation: simple.stub(),
    },
    isAdmin: false,
    isCancellingReservations: false,
    show: true,
    reservationsToCancel: Immutable([
      Reservation.build({ resource: resource.id }),
      Reservation.build({ resource: 'unfetched-resource' }),
    ]),
    resources: Immutable({
      [resource.id]: resource,
    }),
  };

  function getExtraProps(reservation, isAdmin = false) {
    return {
      isAdmin,
      reservationsToCancel: Immutable([reservation]),
      resources: Immutable({
        [resource.id]: resource,
      }),
    };
  }

  function getTree(extraProps = {}) {
    return sd.shallowRender(
      <ReservationCancelModalContainer {...Object.assign({}, props, extraProps)} />
    );
  }

  describe('render', () => {
    describe('when isAdmin is true', () => {
      const isAdmin = true;
      const reservation = Reservation.build({
        resource: resource.id,
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('renders a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('renders a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('contains a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('renders a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle displays text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('renders a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('renders a CompactReservationList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationList');
          expect(list.length).to.equal(1);
        });

        it('passes correct props to CompactReservationList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('renders a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('renders two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button has text "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it calls closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button has text "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('has handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and reservation is not preliminary', () => {
      const isAdmin = false;
      const reservation = Reservation.build({
        needManualConfirmation: false,
        resource: resource.id,
        state: 'confirmed',
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('renders a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('renders a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('contains a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('renders a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle displays text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('renders a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('renders a CompactReservationList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationList');
          expect(list.length).to.equal(1);
        });

        it('passes correct props to CompactReservationList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('renders a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('renders two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button has text "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it calls closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button has text "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('has handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and preliminary reservation state is not "confirmed"', () => {
      const isAdmin = false;
      const reservation = Reservation.build({
        needManualConfirmation: true,
        resource: resource.id,
        state: 'requested',
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('renders a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('renders a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('contains a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('renders a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle displays text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('renders a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('renders a CompactReservationList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationList');
          expect(list.length).to.equal(1);
        });

        it('passes correct props to CompactReservationList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('renders a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('renders two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button has text "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it calls closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button has text "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('has handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and preliminary reservation state is "confirmed"', () => {
      const isAdmin = false;
      const reservation = Reservation.build({
        needManualConfirmation: true,
        resource: resource.id,
        state: 'confirmed',
      });
      const extraProps = getExtraProps(reservation, isAdmin);
      const tree = getTree(extraProps);

      it('renders a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('renders a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('contains a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('renders a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle displays text "Varauksen peruminen"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Varauksen peruminen');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('renders a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('renders resource responsibleContactInfo', () => {
          const modalText = modalBodyTrees[0].subTree('.responsible-contact-info').text();

          expect(modalText).to.contain(responsibleContactInfo);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('renders a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('renders one Button', () => {
            expect(buttonTrees.length).to.equal(1);
          });

          describe('the button', () => {
            const buttonTree = buttonTrees[0];

            it('has text "Takaisin"', () => {
              expect(buttonTree.props.children).to.equal('Takaisin');
            });

            it('clicking it calls closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });
        });
      });
    });
  });

  describe('handleCancel', () => {
    const tree = sd.shallowRender(<ReservationCancelModalContainer {...props} />);
    const instance = tree.getMountedInstance();

    before(() => {
      props.actions.closeReservationCancelModal.reset();
      instance.handleCancel();
    });

    it('calls closeReservationCancelModal', () => {
      expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
    });

    it('calls deleteReservation for each selected reservation', () => {
      expect(props.actions.deleteReservation.callCount).to.equal(
        props.reservationsToCancel.length
      );
    });

    it('calls deleteReservation with correct arguments', () => {
      const actualArgs = props.actions.deleteReservation.lastCall.args;
      const expected = props.reservationsToCancel[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });
  });
});
