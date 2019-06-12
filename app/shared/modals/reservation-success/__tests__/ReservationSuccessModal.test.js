import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedHTMLMessage } from 'react-intl';
import Immutable from 'seamless-immutable';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import ReservationAccessCode from '../../../reservation-access-code/ReservationAccessCode';
import ReservationDate from '../../../reservation-date/ReservationDate';
import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ReservationSuccessModal from '../ReservationSuccessModal';

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

    beforeAll(() => {
      wrapper = getWrapper({ reservationsToShow });
    });

    test('renders a Modal with correct props', () => {
      const modalComponent = wrapper.find(Modal);
      expect(modalComponent.length).toBe(1);
      expect(modalComponent.prop('className')).toBe('reservation-success-modal modal-city-theme');
      expect(modalComponent.prop('onHide')).toBe(defaultProps.closeReservationSuccessModal);
      expect(modalComponent.prop('show')).toBe(defaultProps.show);
    });

    test('renders a ModalHeader component with close button', () => {
      const modalHeader = wrapper.find(Modal.Header);
      expect(modalHeader.length).toBe(1);
      expect(modalHeader.props().closeButton).toBe(true);
    });

    test('renders a ModalTitle with correct title', () => {
      const modalTitle = wrapper.find(Modal.Title);
      expect(modalTitle.length).toBe(1);
      expect(modalTitle.prop('children')).toBe('ReservationSuccessModal.preliminaryReservationTitle');
    });

    test('renders a ModalBody', () => {
      const modalBody = wrapper.find(Modal.Body);
      expect(modalBody.length).toBe(1);
    });

    test('renders a ModalFooter', () => {
      const modalFooter = wrapper.find(Modal.Footer);
      expect(modalFooter.length).toBe(1);
    });

    test('renders a ReservationDate with correct end date prop', () => {
      const reservationDate = wrapper.find(ReservationDate);
      expect(reservationDate.length).toBe(1);
      expect(reservationDate.prop('beginDate')).toBe(begin);
      expect(reservationDate.prop('endDate')).toBe(end);
    });

    test('renders a horizontal line', () => {
      const hr = wrapper.find('hr');
      expect(hr.length).toBe(1);
    });

    describe('text content', () => {
      const texts = [];
      let textContent;

      beforeAll(() => {
        wrapper.find('p').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        wrapper.find('h5').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        textContent = texts.join();
      });

      test('renders correct intro text', () => {
        expect(textContent).toContain('ReservationSuccessModal.preliminaryReservationLead');
        expect(textContent).not.toContain('ReservationSuccessModal.regularReservationLead');
      });

      test('renders additional info', () => {
        const additionalInfo = wrapper.find(FormattedHTMLMessage)
          .filter({ id: 'ReservationSuccessModal.preliminaryReservationInfo' });
        expect(additionalInfo).toHaveLength(1);
      });
    });

    describe('Back button', () => {
      test('is rendered', () => {
        const button = wrapper.find(Button);
        expect(button.length).toBe(1);
      });

      test('has corrext text', () => {
        const buttonText = wrapper.find(Button).props().children;
        expect(buttonText).toBe('common.ok');
      });

      test('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = wrapper.find(Button);
        expect(button.prop('onClick')).toBe(defaultProps.closeReservationSuccessModal);
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

    beforeAll(() => {
      wrapper = getWrapper({ reservationsToShow });
    });

    test('renders a Modal with correct props', () => {
      const modalComponent = wrapper.find(Modal);
      expect(modalComponent.length).toBe(1);
      expect(modalComponent.prop('className')).toBe('reservation-success-modal modal-city-theme');
      expect(modalComponent.prop('onHide')).toBe(defaultProps.closeReservationSuccessModal);
      expect(modalComponent.prop('show')).toBe(defaultProps.show);
    });

    test('renders a ModalHeader component with close button', () => {
      const modalHeader = wrapper.find(Modal.Header);
      expect(modalHeader.length).toBe(1);
      expect(modalHeader.props().closeButton).toBe(true);
    });

    test('renders a ModalTitle with correct title', () => {
      const modalTitle = wrapper.find(Modal.Title);
      expect(modalTitle.length).toBe(1);
      expect(modalTitle.prop('children')).toBe('ReservationSuccessModal.regularReservationTitle');
    });

    test('renders a ModalBody', () => {
      const modalBody = wrapper.find(Modal.Body);
      expect(modalBody.length).toBe(1);
    });

    test('renders a ModalFooter', () => {
      const modalFooter = wrapper.find(Modal.Footer);
      expect(modalFooter.length).toBe(1);
    });

    test('renders a ReservationDate with correct end date prop', () => {
      const reservationDate = wrapper.find(ReservationDate);
      expect(reservationDate.length).toBe(1);
      expect(reservationDate.prop('beginDate')).toBe(begin);
      expect(reservationDate.prop('endDate')).toBe(end);
    });

    describe('text content', () => {
      const texts = [];
      let textContent;

      beforeAll(() => {
        wrapper.find('p').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        wrapper.find('h5').forEach((paragraph) => {
          texts.push(paragraph.text());
        });
        textContent = texts.join();
      });

      test('renders correct intro text', () => {
        expect(textContent).toContain('ReservationSuccessModal.regularReservationLead');
        expect(textContent).not.toContain('ReservationSuccessModal.preliminaryReservationLead');
      });

      test('does not render additional info', () => {
        const additionalInfo = wrapper.find(FormattedHTMLMessage)
          .filter({ id: 'ReservationSuccessModal.preliminaryReservationInfo' });
        expect(additionalInfo).toHaveLength(0);
      });
    });

    describe('Back button', () => {
      test('is rendered', () => {
        const button = wrapper.find(Button);
        expect(button.length).toBe(1);
      });

      test('has correct text', () => {
        const buttonText = wrapper.find(Button).props().children;
        expect(buttonText).toBe('common.ok');
      });

      test('has closeReservationSuccessModal as its onClick prop ', () => {
        const button = wrapper.find(Button);
        expect(button.prop('onClick')).toBe(defaultProps.closeReservationSuccessModal);
      });
    });
  });

  describe('failed reservations', () => {
    function getFailedReservationsList(failedReservations) {
      return getWrapper({ failedReservations }).find('.failed-reservations-list');
    }

    test('are rendered if there are any', () => {
      const failedReservations = [Reservation.build()];
      expect(getFailedReservationsList(failedReservations)).toHaveLength(1);
    });

    test('are not rendered if there are none', () => {
      const failedReservations = [];
      expect(getFailedReservationsList(failedReservations)).toHaveLength(0);
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

      test(
        'renders ReservationAccessCode component with correct reservation',
        () => {
          const accessCode = getWrapper({ reservationsToShow }).find(ReservationAccessCode);

          expect(accessCode.length).toBe(1);
          expect(accessCode.prop('reservation')).toEqual(reservationsToShow[0]);
        }
      );
    });

    describe('if reservation does not have access code', () => {
      const reservationsToShow = Immutable([
        Reservation.build({
          resource: resource.id,
        }),
      ]);

      test('does not render ReservationAccessCode component', () => {
        const accessCode = getWrapper({ reservationsToShow }).find(ReservationAccessCode);

        expect(accessCode.length).toBe(0);
      });
    });
  });
});
