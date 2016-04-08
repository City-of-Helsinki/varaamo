import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import {
  UnconnectedReservationDeleteModal as ReservationDeleteModal,
} from 'containers/ReservationDeleteModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

describe('Container: ReservationDeleteModal', () => {
  const resource = Resource.build();
  const props = {
    actions: {
      closeReservationDeleteModal: simple.stub(),
      deleteReservation: simple.stub(),
    },
    show: true,
    isDeletingReservations: false,
    reservationsToDelete: Immutable([
      Reservation.build({ resource: resource.id }),
      Reservation.build({ resource: 'unfetched-resource' }),
    ]),
    resources: Immutable({
      [resource.id]: resource,
    }),
  };

  describe('render', () => {
    const tree = sd.shallowRender(<ReservationDeleteModal {...props} />);
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

      it('should render a list for selected reservations', () => {
        const listTrees = modalBodyTrees[0].everySubTree('ul');

        expect(listTrees.length).to.equal(1);
      });

      it('should render a list element for each selected reservation', () => {
        const listElementTrees = modalBodyTrees[0].everySubTree('li');

        expect(listElementTrees.length).to.equal(props.reservationsToDelete.length);
      });

      it('should display a TimeRange for each selected reservation', () => {
        const timeRangeTrees = modalBodyTrees[0].everySubTree('TimeRange');

        expect(timeRangeTrees.length).to.equal(props.reservationsToDelete.length);
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

          it('the first button should read "Peruuta"', () => {
            expect(buttonTree.props.children).to.equal('Peruuta');
          });

          it('clicking it should call closeReservationDeleteModal', () => {
            props.actions.closeReservationDeleteModal.reset();
            buttonTree.props.onClick();

            expect(props.actions.closeReservationDeleteModal.callCount).to.equal(1);
          });
        });

        describe('Confirm button', () => {
          const buttonTree = buttonTrees[1];

          it('the second button should read "Peru"', () => {
            expect(buttonTree.props.children).to.equal('Peru');
          });

          it('should have handleDelete as its onClick prop', () => {
            expect(buttonTree.props.onClick).to.equal(instance.handleDelete);
          });
        });
      });
    });
  });

  describe('handleDelete', () => {
    const tree = sd.shallowRender(<ReservationDeleteModal {...props} />);
    const instance = tree.getMountedInstance();

    before(() => {
      props.actions.deleteReservation.reset();
      instance.handleDelete();
    });

    it('should call deleteReservation for each selected reservation', () => {
      expect(props.actions.deleteReservation.callCount).to.equal(props.reservationsToDelete.length);
    });

    it('should call deleteReservation with correct arguments', () => {
      const actualArgs = props.actions.deleteReservation.lastCall.args;
      const expected = props.reservationsToDelete[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });
  });
});
