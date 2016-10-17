import { expect } from 'chai';
import { shallow } from 'enzyme';
import forEach from 'lodash/forEach';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import constants from 'constants/AppConstants';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
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

      it('the ModalTitle displays text "Varauksen vahvistus"', () => {
        const modalTitleTree = tree.subTree('ModalTitle');

        expect(modalTitleTree.props.children).to.equal('Varauksen vahvistus');
      });
    });

    describe('Modal body', () => {
      const modalBodyTrees = tree.everySubTree('ModalBody');

      it('renders a ModalBody component', () => {
        expect(modalBodyTrees.length).to.equal(1);
      });

      it('renders a help text asking for confirmation', () => {
        const textTree = modalBodyTrees[0].subTree('p');
        const expected = 'Oletko varma että haluat tehdä varaukset ajoille:';
        expect(textTree.text()).to.equal(expected);
      });

      it('renders a CompactReservationList component', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList');
        expect(list.length).to.equal(1);
      });

      it('passes correct props to CompactReservationList component', () => {
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

      it('the ModalTitle displays text "Alustava varaus"', () => {
        const modalTitleTree = tree.subTree('ModalTitle');

        expect(modalTitleTree.props.children).to.equal('Alustava varaus');
      });
    });

    describe('Modal body', () => {
      const modalBodyTrees = tree.everySubTree('ModalBody');

      it('renders a ModalBody component', () => {
        expect(modalBodyTrees.length).to.equal(1);
      });

      it('renders a help text asking for confirmation', () => {
        const textTree = modalBodyTrees[0].subTree('p');
        const expected = 'Olet tekemässä alustavaa varausta ajoille:';
        expect(textTree.text()).to.equal(expected);
      });

      it('renders a CompactReservationList component', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList');
        expect(list.length).to.equal(1);
      });

      it('passes correct props to CompactReservationList component', () => {
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

      it('the ModalTitle displays text "Muutosten vahvistus"', () => {
        const modalTitleTree = tree.subTree('ModalTitle');

        expect(modalTitleTree.props.children).to.equal('Muutosten vahvistus');
      });
    });

    describe('Modal body', () => {
      const modalBodyTrees = tree.everySubTree('ModalBody');

      it('renders a ModalBody component', () => {
        expect(modalBodyTrees.length).to.equal(1);
      });

      it('renders two lists', () => {
        const lists = modalBodyTrees[0].everySubTree('CompactReservationList');
        expect(lists.length).to.equal(2);
      });

      it('the first list contains reservations that are edited', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList')[0];
        expect(list.props.reservations).to.deep.equal(props.reservationsToEdit);
      });

      it('the second list contains reservations that are selected', () => {
        const list = modalBodyTrees[0].everySubTree('CompactReservationList')[1];
        expect(list.props.reservations).to.deep.equal(props.selectedReservations);
      });
    });
  });

  describe('rendering ReservationForm', () => {
    const termsAndConditions = 'Some terms and conditions';
    function getForm(needManualConfirmation = false, isAdmin = false, isStaff = false) {
      const resource = Resource.build({
        genericTerms: { fi: termsAndConditions },
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

        it('form fields include staffEvent', () => {
          expect(formFields).to.contain('staffEvent');
        });

        it('form fields include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields include RESERVATION_FORM_FIELDS', () => {
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

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });

        it('form fields does not include termsAndConditions', () => {
          expect(formFields).to.not.contain('termsAndConditions');
        });

        it('form termsAndConditions is an empty string', () => {
          expect(form.prop('termsAndConditions')).to.equal('');
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const isStaff = false;
        const form = getForm(needManualConfirmation, isAdmin, isStaff);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields do not include comments', () => {
          expect(formFields).to.not.contain('comments');
        });

        it('form fields include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.contain(field);
          });
        });

        it('form fields include termsAndConditions', () => {
          expect(formFields).to.contain('termsAndConditions');
        });

        it('form props contain termsAndConditions', () => {
          expect(form.prop('termsAndConditions')).to.equal(termsAndConditions);
        });
      });
    });

    describe('if resource does not need manual confirmation', () => {
      const needManualConfirmation = false;
      describe('if user is an admin', () => {
        const isAdmin = true;
        const form = getForm(needManualConfirmation, isAdmin);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields include comments', () => {
          expect(formFields).to.contain('comments');
        });

        it('form fields do not include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.not.contain(field);
          });
        });

        it('form fields does not include termsAndConditions', () => {
          expect(formFields).to.not.contain('termsAndConditions');
        });

        it('form termsAndConditions is an empty string', () => {
          expect(form.prop('termsAndConditions')).to.equal('');
        });
      });

      describe('if user is a regular user', () => {
        const isAdmin = false;
        const form = getForm(needManualConfirmation, isAdmin);
        const formFields = form.props().fields;

        it('form fields do not include staffEvent', () => {
          expect(formFields).to.not.contain('staffEvent');
        });

        it('form fields do not include comments', () => {
          expect(formFields).to.not.contain('comments');
        });

        it('form fields do not include RESERVATION_FORM_FIELDS', () => {
          forEach(constants.RESERVATION_FORM_FIELDS, (field) => {
            expect(formFields).to.not.contain(field);
          });
        });

        it('form fields include termsAndConditions', () => {
          expect(formFields).to.contain('termsAndConditions');
        });

        it('form props contain termsAndConditions', () => {
          expect(form.prop('termsAndConditions')).to.equal(termsAndConditions);
        });
      });
    });
  });
});
