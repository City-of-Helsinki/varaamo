import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import CompactReservationList from 'shared/compact-reservation-list';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import {
  UnconnectedReservationSuccessModalContainer as ReservationSuccessModalContainer,
} from './ReservationSuccessModalContainer';
import ModalWrapper from '../ModalWrapper';

describe('shared/modals/reservation-success/ReservationSuccessModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    actions: {
      closeReservationSuccessModal: simple.stub(),
    },
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationSuccessModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders a ModalWrapper with correct props', () => {
      const modalWrapper = getWrapper().find(ModalWrapper);

      expect(modalWrapper.length).to.equal(1);
      expect(modalWrapper.prop('className')).to.equal('reservation-success-modal');
      expect(modalWrapper.prop('onClose')).to.equal(
        defaultProps.actions.closeReservationSuccessModal
      );
      expect(modalWrapper.prop('show')).to.equal(defaultProps.show);
      expect(modalWrapper.prop('title')).to.equal('Varauspyyntösi on lähetetty');
    });

    describe('reservation list', () => {
      it('renders a CompactReservationList component', () => {
        const list = getWrapper().find(CompactReservationList);
        expect(list.length).to.equal(1);
      });

      it('passes correct props to CompactReservationList component', () => {
        const actualProps = getWrapper().find(CompactReservationList).props();
        expect(actualProps.reservations).to.deep.equal(defaultProps.reservationsToShow);
        expect(actualProps.resources).to.equal(undefined);
      });
    });

    describe('Back button', () => {
      it('is rendered', () => {
        const button = getWrapper().find(Button);
        expect(button.length).to.equal(1);
      });

      it('has text "Takaisin"', () => {
        const buttonText = getWrapper().find(Button).props().children;
        expect(buttonText).to.equal('Takaisin');
      });

      it('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = getWrapper().find(Button);
        expect(button.prop('onClick')).to.equal(defaultProps.actions.closeReservationSuccessModal);
      });
    });
  });
});
