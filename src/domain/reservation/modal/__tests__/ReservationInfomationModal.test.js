import React from 'react';
import toJSON from 'enzyme-to-json';

import {
  shallowWithIntl,
  globalDateMock,
} from '../../../../../app/utils/testUtils';
import ReservationInformationModal from '../ReservationInformationModal';
import reservation from '../../../../common/data/fixtures/reservation';

const findButtonByLabel = (wrapper, label) =>
  wrapper.find({ children: `ReservationInfoModal.${label}` });

describe('ReservationInformationModal', () => {
  const mockReservation = reservation.build({
    begin: '2019-08-14T14:00:00+03:00',
    end: '2019-08-14T15:00:00+03:00',
    state: 'confirmed',
  });
  const defaultProps = {
    reservation: mockReservation,
    onHide: jest.fn(),
    onSaveComment: jest.fn(),
    isOpen: true,
    onEditReservation: jest.fn(),
    t: (path) => path,
  };
  const getWrapper = (props) =>
    shallowWithIntl(
      <ReservationInformationModal {...defaultProps} {...props} />
    );

  test('renders correctly', () => {
    globalDateMock();

    expect(toJSON(getWrapper())).toMatchSnapshot();
  });

  test('does not render deny and approve buttons by default', () => {
    const wrapper = getWrapper();

    expect(findButtonByLabel(wrapper, 'approveButton').length).toEqual(0);
    expect(findButtonByLabel(wrapper, 'denyButton').length).toEqual(0);
  });

  describe('when state is requested', () => {
    const getWrapperInRequestedState = (props) =>
      getWrapper({
        reservation: { ...defaultProps.reservation, state: 'requested' },
        ...props,
      });

    test('render deny and approve buttons', () => {
      const wrapper = getWrapperInRequestedState();

      expect(findButtonByLabel(wrapper, 'approveButton').length).toEqual(1);
      expect(findButtonByLabel(wrapper, 'denyButton').length).toEqual(1);
    });
  });

  describe('refund policy', () => {
    // eslint-disable-next-line max-len
    test('rendered when resource is not null, when user is admin, when reservation is not a staff event and when the reservation has a price', () => {
      const getRefundPolicy = (wrapper) => {
        return wrapper.find({ id: 'refund-policy' });
      };
      const notAdmin = getWrapper({ isEditing: true, isAdmin: false });
      const admin = getWrapper({
        isEditing: true,
        isAdmin: true,
        reservation: {
          ...mockReservation,
          isStaffEvent: false,
          begin: new Date(2017, 10, 1, 9, 0, 0, 0).toJSON(),
          end: new Date(2017, 10, 1, 11, 0, 0, 0).toJSON(),
        },
        resource: {
          products: [
            {
              price: {
                type: 'per_period',
                period: '01:00',
                amount: 100,
              },
            },
          ],
        },
      });

      expect(getRefundPolicy(notAdmin).length).toEqual(0);
      expect(getRefundPolicy(admin).length).toEqual(1);
    });
  });
});
