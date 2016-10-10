import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import forEach from 'lodash/forEach';
import Immutable from 'seamless-immutable';

import constants from 'constants/AppConstants';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import ConfirmReservationModal from './ConfirmReservationModal';
import ReservationForm from './ReservationForm';

function getProps(props) {
  const defaults = {
    isAdmin: false,
    isEditing: false,
    isMakingReservations: false,
    isPreliminaryReservation: false,
    isStaff: false,
    onClose: simple.stub(),
    onConfirm: simple.stub(),
    reservationsToEdit: Immutable([]),
    resource: Resource.build(),
    selectedReservations: Immutable([]),
    show: true,
  };

  return Object.assign({}, defaults, props);
}

describe('pages/resource/reservation-confirmation/ConfirmReservationModal', () => {
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
        const expected = 'Oletko varma että haluat tehdä varaukset ajoille:';
        expect(textTree.text()).to.equal(expected);
      });

      it('should render a CompactReservationList component', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList');
        expect(list.length).to.equal(1);
      });

      it('should pass correct props to CompactReservationList component', () => {
        const list = modalBodyTrees[0].subTree('CompactReservationList');
        expect(list.props.reservations).to.deep.equal(props.selectedReservations);
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
        const expected = 'Olet tekemässä alustavaa varausta ajoille:';
        expect(textTree.text()).to.equal(expected);
      });

      it('should render a CompactReservationList component', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList');
        expect(list.length).to.equal(1);
      });

      it('should pass correct props to CompactReservationList component', () => {
        const list = modalBodyTrees[0].subTree('CompactReservationList');
        expect(list.props.reservations).to.deep.equal(props.selectedReservations);
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
        const lists = modalBodyTrees[0].everySubTree('CompactReservationList');
        expect(lists.length).to.equal(2);
      });

      it('the first list should contain reservations that are edited', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList')[0];
        expect(list.props.reservations).to.deep.equal(props.reservationsToEdit);
      });

      it('the second list should contain reservations that are selected', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList')[1];
        expect(list.props.reservations).to.deep.equal(props.selectedReservations);
      });
    });
  });

  describe('rendering ReservationForm', () => {
    function getForm(needManualConfirmation = false, isAdmin = false, isStaff = false) {
      const resource = Resource.build({
        needManualConfirmation,
        userPermissions: { isAdmin },
      });
      const props = getProps({ isAdmin, isStaff, resource });
      const wrapper = shallow(<ConfirmReservationModal {...props} />);
      return wrapper.find(ReservationForm);
    }

    describe('if resource needs manual confirmation', () => {
      const needManualConfirmation = true;
      describe('if user is admin and staff', () => {
        const isAdmin = true;
        const isStaff = true;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields should include staffEvent', () => {
          expect(formFields).to.contain('staffEvent');
        });

        it('form fields should include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields should include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });
      });

      describe('if user is an admin', () => {
        const isAdmin = true;
        const isStaff = false;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields should not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields should include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields should include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const isStaff = false;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields should not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields should not include comments', () => {
          expect(formFields).to.not.contain('comments');
        });

        it('form fields should include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });
      });
    });

    describe('if resource does not need manual confirmation', () => {
      const needManualConfirmation = false;
      describe('if user is an admin', () => {
        const isAdmin = true;
        const form = getForm(needManualConfirmation, isAdmin);
        const formFields = form.props().fields;

        it('form fields should not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields should include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields should not include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.not.contain(field);
          });
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const form = getForm(needManualConfirmation, isAdmin);
        const formFields = form.props().fields;

        it('form fields should not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields should not include comments', () => {
          expect(formFields).to.not.contain('comments');
        });

        it('form fields should not include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.not.contain(field);
          });
        });
      });
    });
  });
});
