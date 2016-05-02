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
  const reservationInfo = 'Some reservation info.';
  const resource = Resource.build({ reservationInfo });
  const props = {
    actions: {
      cancelPreliminaryReservation: simple.stub(),
      closeReservationCancelModal: simple.stub(),
    },
    isAdmin: false,
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
    describe('when isAdmin is true', () => {
      const isAdmin = true;
      const extraProps = Object.assign(getExtraProps('requested'), { isAdmin });
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

        it('the ModalTitle should display text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render a CompactReservationsList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationsList');
          expect(list.length).to.equal(1);
        });

        it('should pass correct props to CompactReservationsList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationsList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
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

            it('the first button should read "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button should read "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('should have handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and reservation state is anything but "confirmed"', () => {
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

        it('the ModalTitle should display text "Perumisen vahvistus"', () => {
          const modalTitleTree = tree.subTree('ModalTitle');

          expect(modalTitleTree.props.children).to.equal('Perumisen vahvistus');
        });
      });

      describe('Modal body', () => {
        const modalBodyTrees = tree.everySubTree('ModalBody');

        it('should render a ModalBody component', () => {
          expect(modalBodyTrees.length).to.equal(1);
        });

        it('should render a CompactReservationsList component', () => {
          const list = modalBodyTrees[0].everySubTree('CompactReservationsList');
          expect(list.length).to.equal(1);
        });

        it('should pass correct props to CompactReservationsList component', () => {
          const list = modalBodyTrees[0].subTree('CompactReservationsList');
          expect(list.props.reservations).to.deep.equal(extraProps.reservationsToCancel);
          expect(list.props.resources).to.deep.equal(extraProps.resources);
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

            it('the first button should read "Älä peru varausta"', () => {
              expect(buttonTree.props.children).to.equal('Älä peru varausta');
            });

            it('clicking it should call closeReservationCancelModal', () => {
              props.actions.closeReservationCancelModal.reset();
              buttonTree.props.onClick();

              expect(props.actions.closeReservationCancelModal.callCount).to.equal(1);
            });
          });

          describe('Confirm button', () => {
            const buttonTree = buttonTrees[1];

            it('the second button should read "Peru varaus"', () => {
              expect(buttonTree.props.children).to.equal('Peru varaus');
            });

            it('should have handleCancel as its onClick prop', () => {
              expect(buttonTree.props.onClick).to.equal(instance.handleCancel);
            });
          });
        });
      });
    });

    describe('when isAdmin is false and reservation state is "confirmed"', () => {
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

        it('should render resource reservationInfo', () => {
          const modalText = modalBodyTrees[0].subTree('.reservation-info').text();

          expect(modalText).to.contain(reservationInfo);
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

    it('should call cancelPreliminaryReservation for each selected reservation', () => {
      expect(props.actions.cancelPreliminaryReservation.callCount).to.equal(
        props.reservationsToCancel.length
      );
    });

    it('should call cancelPreliminaryReservation with correct arguments', () => {
      const actualArgs = props.actions.cancelPreliminaryReservation.lastCall.args;
      const expected = props.reservationsToCancel[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });
  });
});
