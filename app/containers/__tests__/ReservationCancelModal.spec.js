import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import {
  UnconnectedReservationCancelModal as ReservationCancelModal,
} from 'containers/ReservationCancelModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

describe('Container: ReservationCancelModal', () => {
  const resource = Resource.build();
  const props = {
    actions: {
      closeReservationCancelModal: simple.stub(),
    },
    show: true,
    reservationsToCancel: Immutable([
      Reservation.build({ resource: resource.id }),
      Reservation.build({ resource: 'unfetched-resource' }),
    ]),
    resources: Immutable({
      [resource.id]: resource,
    }),
  };

  function getExtraProps(reservationState) {
    return {
      reservationsToCancel: Immutable([
        Reservation.build({ resource: resource.id, state: reservationState }),
        Reservation.build({ resource: resource.id, state: reservationState }),
      ]),
      resources: Immutable({
        [resource.id]: resource,
      }),
    };
  }

  function getTree(extraProps = {}) {
    return sd.shallowRender(<ReservationCancelModal {...Object.assign({}, props, extraProps)} />);
  }

  describe('render', () => {
    describe('when reservation state is anything but "confirmed"', () => {
      const extraProps = getExtraProps('requested');
      const tree = getTree(extraProps);
      const instance = tree.getMountedInstance();

      it('should render a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('should render a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('should contain a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('should render a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle should display text "Varauksen perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Varauksen perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render a list for selected reservations', () => {
          const listTrees = modalBodyTrees[0].everySubTree('ul');

          expect(listTrees.length).to.equal(1);
        });

        it('should render a list element for each selected reservation', () => {
          const listElementTrees = modalBodyTrees[0].everySubTree('li');

          expect(listElementTrees.length).to.equal(props.reservationsToCancel.length);
        });

        it('should display a TimeRange for each selected reservation', () => {
          const timeRangeTrees = modalBodyTrees[0].everySubTree('TimeRange');

          expect(timeRangeTrees.length).to.equal(props.reservationsToCancel.length);
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('should render a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('should render two Buttons', () => {
            expect(buttonTrees.length).to.equal(2);
          });

          describe('Cancel button', () => {
            const buttonTree = buttonTrees[0];

            it('the first button should read "Älä peruuta varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peruuta varausta');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button should read "Peruuta varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peruuta varaus');
            });

            it('should have handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when reservation state is "confirmed"', () => {
      const extraProps = getExtraProps('confirmed');
      const tree = getTree(extraProps);

      it('should render a Modal component', () => {
        const modalTrees = tree.everySubTree('Modal');

        expect(modalTrees.length).to.equal(1);
      });

      describe('Modal header', () => {
        const modalHeaderTrees = tree.everySubTree('ModalHeader');

        it('should render a ModalHeader component', () => {
          expect(modalHeaderTrees.length).to.equal(1);
        });

        it('should contain a close button', () => {
          expect(modalHeaderTrees[0].props.closeButton).to.equal(true);
        });

        it('should render a ModalTitle component', () => {
          const modalTitleTrees = tree.everySubTree('ModalTitle');

          expect(modalTitleTrees.length).to.equal(1);
        });

        it('the ModalTitle should display text "Varauksen peruminen"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Varauksen peruminen');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render contact information', () => {
          const addressTree = modalBodyTrees[0].subTree('address');

          expect(addressTree).to.be.ok;
        });
      });

      describe('Modal footer', () => {
        const modalFooterTrees = tree.everySubTree('ModalFooter');

        it('should render a ModalFooter component', () => {
          expect(modalFooterTrees.length).to.equal(1);
        });

        describe('Footer buttons', () => {
          const buttonTrees = modalFooterTrees[0].everySubTree('Button');

          it('should render one Button', () => {
            expect(buttonTrees.length).to.equal(1);
          });

          describe('the button', () => {
            const buttonTree = buttonTrees[0];

            it('should read "Takaisin"', () => {
              expect(buttonTree.props.children).to.equal('Takaisin');
            });

            it('clicking it should call closeReservationCancelModal', () => {
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
    const tree = sd.shallowRender(<ReservationCancelModal {...props} />);
    const instance = tree.getMountedInstance();

    before(() => {
      props.actions.closeReservationCancelModal.reset();
      instance.handleCancel();
    });

    it('should call closeReservationCancelModal', () => {
      expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
    });
  });
});
