import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import ReservationInformationModal from '../ReservationInformationModal';
import reservation from '../../../../common/data/fixtures/reservation';

const findButtonByLabel = (wrapper, label) => wrapper.find({ children: `ReservationInfoModal.${label}` });

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
    t: path => path,
  };
  const getWrapper = props => shallowWithIntl(
    <ReservationInformationModal {...defaultProps} {...props} />,
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
    const getWrapperInRequestedState = props => getWrapper({
      reservation: { ...defaultProps.reservation, state: 'requested' },
      ...props,
    });

    test('render deny and approve buttons', () => {
      const wrapper = getWrapperInRequestedState();

      expect(findButtonByLabel(wrapper, 'approveButton').length).toEqual(1);
      expect(findButtonByLabel(wrapper, 'denyButton').length).toEqual(1);
    });
  });
});
