import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

function getProps(props) {
  const defaults = {
    isEditing: false,
    isMakingReservations: false,
    isPreliminaryReservation: false,
    onClose: simple.stub(),
    onConfirm: simple.stub(),
    reservationsToEdit: Immutable([]),
    resource: Resource.build(),
    selectedReservations: Immutable([]),
    show: true,
  };

  return Object.assign({}, defaults, props);
}

describe('Component: reservation/ConfirmReservationModal', () => {
  describe('when making a normal reservation', () => {
    const props = getProps({
      selectedReservations: Immutable([
        Reservation.build(),
        Reservation.build(),
      ]),
    });
    const tree = sd.shallowRender(<ConfirmReservationModal {...props} />);
    const instance = tree.getMountedInstance();
    instance.refs = {
      commentInput: { getValue: simple.stub() },
    };

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

      it('the ModalTitle should display text "Varauksen vahvistus"', () => {
        const modalTitleTree = tree.subTree('ModalTitle');

        expect(modalTitleTree.props.children).to.equal('Varauksen vahvistus');
      });
    });

    describe('Modal body', () => {
      const modalBodyTrees = tree.everySubTree('ModalBody');

      it('should render a ModalBody component', () => {
        expect(modalBodyTrees.length).to.equal(1);
      });

      it('should render a help text asking for confirmation', () => {
        const textTree = modalBodyTrees[0].subTree('p');
        const expected = 'Oletko varma että haluat tehdä seuraavat varaukset?';
        expect(textTree.text()).to.equal(expected);
      });

      it('should render a list for selected reservations', () => {
        const listTrees = modalBodyTrees[0].everySubTree('ul');

        expect(listTrees.length).to.equal(1);
      });

      it('should render a list element for each selected reservation', () => {
        const listElementTrees = modalBodyTrees[0].everySubTree('li');

        expect(listElementTrees.length).to.equal(props.selectedReservations.length);
      });

      it('should display a TimeRange for each selected reservation', () => {
        const timeRangeTrees = modalBodyTrees[0].everySubTree('TimeRange');

        expect(timeRangeTrees.length).to.equal(props.selectedReservations.length);
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

          it('clicking it should call props.onClose', () => {
            props.onClose.reset();
            buttonTree.props.onClick();

            expect(props.onClose.callCount).to.equal(1);
          });
        });

        describe('Confirm button', () => {
          const buttonTree = buttonTrees[1];

          it('the second button should read "Tallenna"', () => {
            expect(buttonTree.props.children).to.equal('Tallenna');
          });

          it('clicking it should call props.onConfirm and props.onClose', () => {
            props.onConfirm.reset();
            props.onClose.reset();
            buttonTree.props.onClick();

            expect(props.onConfirm.callCount).to.equal(1);
            expect(props.onClose.callCount).to.equal(1);
          });
        });
      });
    });
  });

  describe('when making a preliminary reservation', () => {
    const props = getProps({
      isPreliminaryReservation: true,
      resource: Resource.build({ needManualConfirmation: true }),
      selectedReservations: Immutable([
        Reservation.build(),
        Reservation.build(),
      ]),
    });
    const tree = sd.shallowRender(<ConfirmReservationModal {...props} />);
    const instance = tree.getMountedInstance();
    instance.refs = {
      commentInput: { getValue: simple.stub() },
    };

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

      it('the ModalTitle should display text "Alustava varaus"', () => {
        const modalTitleTree = tree.subTree('ModalTitle');

        expect(modalTitleTree.props.children).to.equal('Alustava varaus');
      });
    });

    describe('Modal body', () => {
      const modalBodyTrees = tree.everySubTree('ModalBody');

      it('should render a ModalBody component', () => {
        expect(modalBodyTrees.length).to.equal(1);
      });

      it('should render a help text asking for confirmation', () => {
        const textTree = modalBodyTrees[0].subTree('p');
        const expected = 'Olet tekemässä alustavaa varausta seuraaville ajoille:';
        expect(textTree.text()).to.equal(expected);
      });

      it('should render a list for selected reservations', () => {
        const listTrees = modalBodyTrees[0].everySubTree('ul');

        expect(listTrees.length).to.equal(1);
      });

      it('should render a list element for each selected reservation', () => {
        const listElementTrees = modalBodyTrees[0].everySubTree('li');

        expect(listElementTrees.length).to.equal(props.selectedReservations.length);
      });

      it('should display a TimeRange for each selected reservation', () => {
        const timeRangeTrees = modalBodyTrees[0].everySubTree('TimeRange');

        expect(timeRangeTrees.length).to.equal(props.selectedReservations.length);
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

          it('clicking it should call props.onClose', () => {
            props.onClose.reset();
            buttonTree.props.onClick();

            expect(props.onClose.callCount).to.equal(1);
          });
        });

        describe('Confirm button', () => {
          const buttonTree = buttonTrees[1];

          it('the second button should read "Tallenna"', () => {
            expect(buttonTree.props.children).to.equal('Tallenna');
          });

          it('clicking it should call props.onConfirm and props.onClose', () => {
            props.onConfirm.reset();
            props.onClose.reset();
            buttonTree.props.onClick();

            expect(props.onConfirm.callCount).to.equal(1);
            expect(props.onClose.callCount).to.equal(1);
          });
        });
      });
    });
  });

  describe('when editing reservations', () => {
    const props = getProps({
      isEditing: true,
      reservationsToEdit: Immutable([Reservation.build()]),
      resource: Resource.build(),
      selectedReservations: Immutable([
        Reservation.build(),
        Reservation.build(),
      ]),
    });
    const tree = sd.shallowRender(<ConfirmReservationModal {...props} />);
    const instance = tree.getMountedInstance();
    instance.refs = {
      commentInput: { getValue: simple.stub() },
    };

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

      it('the ModalTitle should display text "Muutosten vahvistus"', () => {
        const modalTitleTree = tree.subTree('ModalTitle');

        expect(modalTitleTree.props.children).to.equal('Muutosten vahvistus');
      });
    });

    describe('Modal body', () => {
      const modalBodyTrees = tree.everySubTree('ModalBody');

      it('should render a ModalBody component', () => {
        expect(modalBodyTrees.length).to.equal(1);
      });

      it('should render two lists', () => {
        const listTrees = modalBodyTrees[0].everySubTree('ul');

        expect(listTrees.length).to.equal(2);
      });

      it('the first list should contain reservations that are edited', () => {
        const listTree = modalBodyTrees[0].everySubTree('ul')[0];
        const timeRangeTrees = listTree.everySubTree('TimeRange');

        timeRangeTrees.forEach((timeRangeTree, index) => {
          expect(timeRangeTree.props.begin).to.equal(props.reservationsToEdit[index].begin);
          expect(timeRangeTree.props.end).to.equal(props.reservationsToEdit[index].end);
        });
      });

      it('the second list should contain reservations that are selected', () => {
        const listTree = modalBodyTrees[0].everySubTree('ul')[1];
        const timeRangeTrees = listTree.everySubTree('TimeRange');

        timeRangeTrees.forEach((timeRangeTree, index) => {
          expect(timeRangeTree.props.begin).to.equal(props.selectedReservations[index].begin);
          expect(timeRangeTree.props.end).to.equal(props.selectedReservations[index].end);
        });
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

          it('clicking it should call props.onClose', () => {
            props.onClose.reset();
            buttonTree.props.onClick();

            expect(props.onClose.callCount).to.equal(1);
          });
        });

        describe('Confirm button', () => {
          const buttonTree = buttonTrees[1];

          it('the second button should read "Tallenna"', () => {
            expect(buttonTree.props.children).to.equal('Tallenna');
          });

          it('clicking it should call props.onConfirm and props.onClose', () => {
            props.onConfirm.reset();
            props.onClose.reset();
            buttonTree.props.onClick();

            expect(props.onConfirm.callCount).to.equal(1);
            expect(props.onClose.callCount).to.equal(1);
          });
        });
      });
    });
  });
});
