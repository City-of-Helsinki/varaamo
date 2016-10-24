import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import CompactReservationList from 'shared/compact-reservation-list';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import ReservationSuccessModal from './ReservationSuccessModal';
import ModalWrapper from '../ModalWrapper';

describe('shared/modals/reservation-success/ReservationSuccessModal', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    closeReservationSuccessModal: simple.stub(),
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
    user: { email: 'han@solo.com' },
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationSuccessModal {...defaultProps} {...extraProps} />);
  }

  describe('if reservation is preliminary', () => {
    const reserverEmailAddress = 'luke@skywalker.com';
    const reservationsToShow = Immutable([
      Reservation.build({
        needManualConfirmation: true,
        reserverEmailAddress,
        resource: resource.id,
      }),
    ]);
    let wrapper;

    before(() => {
      wrapper = getWrapper({ reservationsToShow });
    });

    it('renders a ModalWrapper with correct props', () => {
      const modalWrapper = wrapper.find(ModalWrapper);

      expect(modalWrapper.length).to.equal(1);
      expect(modalWrapper.prop('className')).to.equal('reservation-success-modal');
      expect(modalWrapper.prop('onClose')).to.equal(
        defaultProps.closeReservationSuccessModal
      );
      expect(modalWrapper.prop('show')).to.equal(defaultProps.show);
      expect(modalWrapper.prop('title')).to.equal('Varauspyyntösi on lähetetty');
    });

    describe('text content', () => {
      const texts = [];
      let textContent;

      before(() => {
        wrapper.find('p').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        textContent = texts.join();
      });

      it('renders correct intro text', () => {
        expect(textContent).to.contain('Olet tehnyt alustavan varauksen tilaan');
        expect(textContent).to.not.contain('Varaus tehty tilaan');
      });

      it('renders additional info', () => {
        expect(textContent).to.contain('Tarkemmat tiedot alustavasta varauksesta');
      });

      it('renders reserver email', () => {
        expect(textContent).to.contain(reserverEmailAddress);
      });
    });

    describe('reservation list', () => {
      it('renders a CompactReservationList component', () => {
        const list = wrapper.find(CompactReservationList);
        expect(list.length).to.equal(1);
      });

      it('passes correct props to CompactReservationList component', () => {
        const actualProps = wrapper.find(CompactReservationList).props();
        expect(actualProps.reservations).to.deep.equal(reservationsToShow);
        expect(actualProps.resources).to.equal(undefined);
      });
    });

    describe('Back button', () => {
      it('is rendered', () => {
        const button = wrapper.find(Button);
        expect(button.length).to.equal(1);
      });

      it('has text "Takaisin"', () => {
        const buttonText = wrapper.find(Button).props().children;
        expect(buttonText).to.equal('Takaisin');
      });

      it('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = wrapper.find(Button);
        expect(button.prop('onClick')).to.equal(defaultProps.closeReservationSuccessModal);
      });
    });
  });

  describe('if reservation is regular', () => {
    const reservationsToShow = Immutable([
      Reservation.build({ needManualConfirmation: false, resource: resource.id }),
    ]);
    let wrapper;

    before(() => {
      wrapper = getWrapper({ reservationsToShow });
    });

    it('renders a ModalWrapper with correct props', () => {
      const modalWrapper = wrapper.find(ModalWrapper);

      expect(modalWrapper.length).to.equal(1);
      expect(modalWrapper.prop('className')).to.equal('reservation-success-modal');
      expect(modalWrapper.prop('onClose')).to.equal(
        defaultProps.closeReservationSuccessModal
      );
      expect(modalWrapper.prop('show')).to.equal(defaultProps.show);
      expect(modalWrapper.prop('title')).to.equal('Varauksen tekeminen onnistui');
    });

    describe('text content', () => {
      const texts = [];
      let textContent;

      before(() => {
        wrapper.find('p').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        textContent = texts.join();
      });

      it('renders correct intro text', () => {
        expect(textContent).to.contain('Varaus tehty tilaan');
        expect(textContent).to.not.contain('Olet tehnyt alustavan varauksen tilaan');
      });

      it('does not render additional info', () => {
        expect(textContent).to.not.contain('Tarkemmat tiedot alustavasta varauksesta');
      });
    });

    describe('reservation list', () => {
      it('renders a CompactReservationList component', () => {
        const list = wrapper.find(CompactReservationList);
        expect(list.length).to.equal(1);
      });

      it('passes correct props to CompactReservationList component', () => {
        const actualProps = wrapper.find(CompactReservationList).props();
        expect(actualProps.reservations).to.deep.equal(reservationsToShow);
        expect(actualProps.resources).to.equal(undefined);
      });
    });

    describe('Back button', () => {
      it('is rendered', () => {
        const button = wrapper.find(Button);
        expect(button.length).to.equal(1);
      });

      it('has text "Takaisin"', () => {
        const buttonText = wrapper.find(Button).props().children;
        expect(buttonText).to.equal('Takaisin');
      });

      it('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = wrapper.find(Button);
        expect(button.prop('onClick')).to.equal(defaultProps.closeReservationSuccessModal);
      });
    });
  });

  describe('access code', () => {
    describe('if reservation has access code', () => {
      const reservationsToShow = Immutable([
        Reservation.build({
          accessCode: '9999',
          resource: resource.id,
        }),
      ]);

      it('renders ReservationAccessCode component with correct reservation', () => {
        const accessCode = getWrapper({ reservationsToShow }).find('ReservationAccessCode');

        expect(accessCode.length).to.equal(1);
        expect(accessCode.prop('reservation')).to.deep.equal(reservationsToShow[0]);
      });
    });

    describe('if reservation does not have access code', () => {
      const reservationsToShow = Immutable([
        Reservation.build({
          resource: resource.id,
        }),
      ]);

      it('does not render ReservationAccessCode component', () => {
        const accessCode = getWrapper({ reservationsToShow }).find('ReservationAccessCode');

        expect(accessCode.length).to.equal(0);
      });
    });
  });
});
