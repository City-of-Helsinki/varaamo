import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import ConfirmReservationModal from 'components/reservation/ConfirmReservationModal';
import Reservation from 'fixtures/Reservation';

describe('Component: reservation/ConfirmReservationModal', () => {
  const props = {
    isMakingReservations: false,
    onClose: simple.stub(),
    onConfirm: simple.stub(),
    selectedReservations: Immutable([
      Reservation.build(),
      Reservation.build(),
    ]),
    show: true,
  };
  const tree = sd.shallowRender(<ConfirmReservationModal {...props} />);

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
      expect(modalHeaderTrees[0].getRenderOutput().props.closeButton).to.equal(true);
    });

    it('should render a ModalTitle component', () => {
      const modalTitleTrees = tree.everySubTree('ModalTitle');

      expect(modalTitleTrees.length).to.equal(1);
    });

    it('the ModalTitle should display text "Varauksen varmistus"', () => {
      const modalTitleVdom = tree.subTree('ModalTitle').getRenderOutput();

      expect(modalTitleVdom.props.children).to.equal('Varauksen varmistus');
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
        const buttonVdom = buttonTrees[0].getRenderOutput();

        it('the first button should read "Peruuta"', () => {
          expect(buttonVdom.props.children).to.equal('Peruuta');
        });

        it('clicking it should call props.onClose', () => {
          props.onClose.reset();
          buttonVdom.props.onClick();

          expect(props.onClose.callCount).to.equal(1);
        });
      });

      describe('Confirm button', () => {
        const buttonVdom = buttonTrees[1].getRenderOutput();

        it('the second button should read "Varaa"', () => {
          expect(buttonVdom.props.children).to.equal('Varaa');
        });

        it('clicking it should call props.onConfirm and props.onClose', () => {
          props.onConfirm.reset();
          props.onClose.reset();
          buttonVdom.props.onClick();

          expect(props.onConfirm.callCount).to.equal(1);
          expect(props.onClose.callCount).to.equal(1);
        });
      });
    });
  });
});
