import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';
import Immutable from 'seamless-immutable';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import ReservationAccessCode from 'shared/reservation-access-code';
import Reservation from 'utils/fixtures/Reservation';
import ReservationDate from 'shared/reservation-date';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationSuccessModal from './ReservationSuccessModal';

describe('shared/modals/reservation-success/ReservationSuccessModal', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    closeReservationSuccessModal: simple.stub(),
    failedReservations: [],
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
    user: { email: 'han@solo.com' },
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationSuccessModal {...defaultProps} {...extraProps} />);
  }

  describe('if reservation is preliminary', () => {
    const begin = '2018-01-31T13:00:00+02:00';
    const end = '2018-01-31T13:30:00+02:00';
    const reserverEmailAddress = 'luke@skywalker.com';
    const reservationsToShow = Immutable([
      Reservation.build({
        begin,
        end,
        needManualConfirmation: true,
        reserverEmailAddress,
        resource: resource.id,
      }),
    ]);
    let wrapper;

    before(() => {
      wrapper = getWrapper({ reservationsToShow });
    });

    it('renders a Modal with correct props', () => {
      const modalComponent = wrapper.find(Modal);
      expect(modalComponent.length).to.equal(1);
      expect(modalComponent.prop('className')).to.equal('reservation-success-modal modal-city-theme');
      expect(modalComponent.prop('onHide')).to.equal(
        defaultProps.closeReservationSuccessModal
      );
      expect(modalComponent.prop('show')).to.equal(defaultProps.show);
    });

    it('renders a ModalHeader component with close button', () => {
      const modalHeader = wrapper.find(Modal.Header);
      expect(modalHeader.length).to.equal(1);
      expect(modalHeader.props().closeButton).to.equal(true);
    });

    it('renders a ModalTitle with correct title', () => {
      const modalTitle = wrapper.find(Modal.Title);
      expect(modalTitle.length).to.equal(1);
      expect(modalTitle.prop('children')).to.equal('ReservationSuccessModal.preliminaryReservationTitle');
    });

    it('renders a ModalBody', () => {
      const modalBody = wrapper.find(Modal.Body);
      expect(modalBody.length).to.equal(1);
    });

    it('renders a ModalFooter', () => {
      const modalFooter = wrapper.find(Modal.Footer);
      expect(modalFooter.length).to.equal(1);
    });

    it('renders a ReservationDate with correct end date prop', () => {
      const reservationDate = wrapper.find(ReservationDate);
      expect(reservationDate.length).to.equal(1);
      expect(reservationDate.prop('beginDate')).to.equal(begin);
      expect(reservationDate.prop('endDate')).to.equal(end);
    });

    it('renders a horizontal line', () => {
      const hr = wrapper.find('hr');
      expect(hr.length).to.equal(1);
    });

    describe('text content', () => {
      const texts = [];
      let textContent;

      before(() => {
        wrapper.find('p').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        wrapper.find('h5').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        textContent = texts.join();
      });

      it('renders correct intro text', () => {
        expect(textContent).to.contain('ReservationSuccessModal.preliminaryReservationLead');
        expect(textContent).to.not.contain('ReservationSuccessModal.regularReservationLead');
      });

      it('renders additional info', () => {
        const additionalInfo = wrapper.find(FormattedHTMLMessage)
          .filter({ id: 'ReservationSuccessModal.preliminaryReservationInfo' });
        expect(additionalInfo).to.have.length(1);
      });
    });

    describe('Back button', () => {
      it('is rendered', () => {
        const button = wrapper.find(Button);
        expect(button.length).to.equal(1);
      });

      it('has corrext text', () => {
        const buttonText = wrapper.find(Button).props().children;
        expect(buttonText).to.equal('common.ok');
      });

      it('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = wrapper.find(Button);
        expect(button.prop('onClick')).to.equal(defaultProps.closeReservationSuccessModal);
      });
    });
  });

  describe('if reservation is regular', () => {
    const begin = '2018-01-31T13:00:00+02:00';
    const end = '2018-01-31T13:30:00+02:00';
    const reservationsToShow = Immutable([
      Reservation.build({
        begin,
        end,
        needManualConfirmation: false,
        resource: resource.id,
      }),
    ]);
    let wrapper;

    before(() => {
      wrapper = getWrapper({ reservationsToShow });
    });

    it('renders a Modal with correct props', () => {
      const modalComponent = wrapper.find(Modal);
      expect(modalComponent.length).to.equal(1);
      expect(modalComponent.prop('className')).to.equal('reservation-success-modal modal-city-theme');
      expect(modalComponent.prop('onHide')).to.equal(
        defaultProps.closeReservationSuccessModal
      );
      expect(modalComponent.prop('show')).to.equal(defaultProps.show);
    });

    it('renders a ModalHeader component with close button', () => {
      const modalHeader = wrapper.find(Modal.Header);
      expect(modalHeader.length).to.equal(1);
      expect(modalHeader.props().closeButton).to.equal(true);
    });

    it('renders a ModalTitle with correct title', () => {
      const modalTitle = wrapper.find(Modal.Title);
      expect(modalTitle.length).to.equal(1);
      expect(modalTitle.prop('children')).to.equal('ReservationSuccessModal.regularReservationTitle');
    });

    it('renders a ModalBody', () => {
      const modalBody = wrapper.find(Modal.Body);
      expect(modalBody.length).to.equal(1);
    });

    it('renders a ModalFooter', () => {
      const modalFooter = wrapper.find(Modal.Footer);
      expect(modalFooter.length).to.equal(1);
    });

    it('renders a ReservationDate with correct end date prop', () => {
      const reservationDate = wrapper.find(ReservationDate);
      expect(reservationDate.length).to.equal(1);
      expect(reservationDate.prop('beginDate')).to.equal(begin);
      expect(reservationDate.prop('endDate')).to.equal(end);
    });

    describe('text content', () => {
      const texts = [];
      let textContent;

      before(() => {
        wrapper.find('p').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        wrapper.find('h5').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        textContent = texts.join();
      });

      it('renders correct intro text', () => {
        expect(textContent).to.contain('ReservationSuccessModal.regularReservationLead');
        expect(textContent).to.not.contain('ReservationSuccessModal.preliminaryReservationLead');
      });

      it('does not render additional info', () => {
        const additionalInfo = wrapper.find(FormattedHTMLMessage)
          .filter({ id: 'ReservationSuccessModal.preliminaryReservationInfo' });
        expect(additionalInfo).to.have.length(0);
      });
    });

    describe('Back button', () => {
      it('is rendered', () => {
        const button = wrapper.find(Button);
        expect(button.length).to.equal(1);
      });

      it('has correct text', () => {
        const buttonText = wrapper.find(Button).props().children;
        expect(buttonText).to.equal('common.ok');
      });

      it('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = wrapper.find(Button);
        expect(button.prop('onClick')).to.equal(defaultProps.closeReservationSuccessModal);
      });
    });
  });

  describe('failed reservations', () => {
    function getFailedReservationsList(failedReservations) {
      return getWrapper({ failedReservations }).find('.failed-reservations-list');
    }

    it('are rendered if there are any', () => {
      const failedReservations = [Reservation.build()];
      expect(getFailedReservationsList(failedReservations)).to.have.length(1);
    });

    it('are not rendered if there are none', () => {
      const failedReservations = [];
      expect(getFailedReservationsList(failedReservations)).to.have.length(0);
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
        const accessCode = getWrapper({ reservationsToShow }).find(ReservationAccessCode);

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
        const accessCode = getWrapper({ reservationsToShow }).find(ReservationAccessCode);

        expect(accessCode.length).to.equal(0);
      });
    });
  });
});
