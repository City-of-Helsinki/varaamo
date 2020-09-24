import React from 'react';
import toJSON from 'enzyme-to-json';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import ReservationCancelModal from '../ReservationCancelModal';
import reservation from '../../../../common/data/fixtures/reservation';
import CompactReservationList from '../../../../../app/shared/compact-reservation-list/CompactReservationList';

describe('domain/reservation/modal/ReservationCancelModal', () => {
  const mockReservation = reservation.build({ begin: '2019-08-14T14:00:00+03:00', end: '2019-08-14T15:00:00+03:00' });
  const props = {
    t: jest.fn(),
    billable: false,
    onEditReservation: jest.fn(),
    parentToggle: jest.fn(),
    reservation: mockReservation,
    toggleShow: true,
    cancelCategories: [],
  };

  const getWrapper = (customProps = {}) => {
    return shallowWithIntl(<ReservationCancelModal {...props} {...customProps} />);
  };

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Modal', () => {
    test('renders correctly', () => {
      const extraProps = {
        userId: 'foo',
        users: { bar: 'bar' },
      };
      globalDateMock();
      const wrapper = shallowWithIntl(
        <ReservationCancelModal {...props} {...extraProps} />,
      );
      expect(toJSON(wrapper)).toMatchSnapshot();
    });

    test('renders a checkbox when the resource is billable', () => {
      globalDateMock();
      const extraProps = {
        userId: 'foo',
        users: { bar: 'bar' },
        billable: true,
      };
      const wrapper = shallowWithIntl(
        <ReservationCancelModal {...props} {...extraProps} />,
      );
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
  });

  describe('Modal header', () => {
    function getModalHeaderWrapper(extraProps) {
      return getWrapper(extraProps).find(Modal.Header);
    }

    test('is rendered', () => {
      expect(getModalHeaderWrapper()).toHaveLength(1);
    });

    test('contains a close button', () => {
      expect(getModalHeaderWrapper().props().closeButton).toBe(true);
    });

    describe('title', () => {
      test('is correct if cancel is allowed', () => {
        const modalTitle = getModalHeaderWrapper({ cancelAllowed: true }).find(Modal.Title);
        expect(modalTitle.length).toBe(1);
        expect(modalTitle.prop('children')).toBe('ReservationCancelModal.cancelAllowedTitle');
      });
    });
  });

  describe('Modal body', () => {
    function getModalBodyWrapper(extraProps) {
      return getWrapper(extraProps).find(Modal.Body);
    }

    test('is rendered', () => {
      expect(getModalBodyWrapper).toHaveLength(1);
    });
    test('renders CompactReservationList', () => {
      expect(
        getModalBodyWrapper().find(CompactReservationList),
      ).toHaveLength(1);
    });

    test('does not render responsibleContactInfo', () => {
      expect(
        getModalBodyWrapper().find('.responsible-contact-info'),
      ).toHaveLength(0);
    });
  });

  describe('Footer buttons', () => {
    function getFooterButtonsWrapper(extraProps) {
      return getWrapper(extraProps).find(Modal.Footer).find(Button);
    }

    describe('if cancel is allowed', () => {
      const buttons = getFooterButtonsWrapper();

      test('renders cancel button', () => {
        expect(buttons.at(0).props().children).toBe('ReservationCancelModal.cancelAllowedCancel');
      });

      test('renders confirm button', () => {
        expect(buttons.at(1).props().children).toBe('ReservationCancelModal.cancelAllowedConfirm');
      });
    });
  });
});
