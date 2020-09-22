import React from 'react';
import toJSON from 'enzyme-to-json';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import ReservationCancelNotAllowed from '../ReservationCancelNotAllowed';
import resource from '../../../../common/data/fixtures/resource';
import CompactReservationList from '../../../../../app/shared/compact-reservation-list/CompactReservationList';

describe('domain/reservation/modal/ReservationCancelNotAllowed', () => {
  const mockResource = resource.build();
  const props = {
    parentToggle: jest.fn(),
    resource: mockResource,
    toggleShow: true,
    billable: true,
  };

  const getWrapper = (customProps = {}) => {
    return shallowWithIntl(<ReservationCancelNotAllowed {...props} {...customProps} />);
  };

  describe('Modal', () => {
    test('renders correctly', () => {
      globalDateMock();
      const extraProps = {
        t: jest.fn(),
      };

      const wrapper = shallowWithIntl(
        <ReservationCancelNotAllowed {...props} {...extraProps} />,
      );
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
  });

  describe('Modal header', () => {
    function getModalHeaderWrapper(customProps) {
      return getWrapper(customProps).find(Modal.Header);
    }

    test('is rendered', () => {
      expect(getModalHeaderWrapper()).toHaveLength(1);
    });

    test('contains a close button', () => {
      expect(getModalHeaderWrapper().props().closeButton).toBe(true);
    });

    test('title is correct if cancel is not allowed', () => {
      const modalTitle = getModalHeaderWrapper().find(Modal.Title);
      expect(modalTitle.length).toBe(1);
      expect(modalTitle.prop('children')).toBe('ReservationCancelModal.cancelNotAllowedTitle');
    });
  });

  describe('Modal body', () => {
    function getModalBodyWrapper(customProps) {
      return getWrapper(customProps).find(Modal.Body);
    }

    test('is rendered', () => {
      expect(getModalBodyWrapper).toHaveLength(1);
    });

    test('renders responsibleContactInfo', () => {
      const responsibleContactInfo = 'Will Howell';

      expect(
        getModalBodyWrapper({
          resource: resource.build({ responsibleContactInfo }),
        }).dive().text(),
      ).toMatch(responsibleContactInfo);
    });

    test('does not render CompactReservationList', () => {
      expect(
        getModalBodyWrapper().find(CompactReservationList),
      ).toHaveLength(0);
    });
  });

  describe('Footer buttons', () => {
    function getFooterButtonsWrapper(extraProps) {
      return getWrapper(extraProps).find(Modal.Footer).find(Button);
    }

    const buttons = getFooterButtonsWrapper();

    test('renders back button', () => {
      expect(buttons.at(0).props().children).toBe('common.back');
    });
  });
});
