import React from 'react';
import toJSON from 'enzyme-to-json';

import { UntranslatedManageReservationsDropdown as ManageReservationsDropdown } from '../ManageReservationsDropdown';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import reservation from '../../../../../common/data/fixtures/reservation';

const findButtonByLabel = (wrapper, label) => wrapper.find({ children: `ManageReservationsList.actionLabel.${label}` });

describe('ManageReservationsDropdown', () => {
  const defaultProps = {
    reservation: reservation.build({ state: null }),
    t: path => path,
    userCanModify: true,
  };
  const getWrapper = props => shallowWithIntl(
    <ManageReservationsDropdown {...defaultProps} {...props} />,
  );

  test('renders correctly', () => {
    expect(toJSON(getWrapper())).toMatchSnapshot();
  });

  test('show information and edit buttons', () => {
    const wrapper = getWrapper();

    expect(findButtonByLabel(wrapper, 'information').length).toEqual(1);
    expect(findButtonByLabel(wrapper, 'edit').length).toEqual(1);
  });

  test('do not show approve, deny and cancel buttons', () => {
    const wrapper = getWrapper();

    expect(findButtonByLabel(wrapper, 'approve').length).toEqual(0);
    expect(findButtonByLabel(wrapper, 'deny').length).toEqual(0);
    expect(findButtonByLabel(wrapper, 'cancel').length).toEqual(0);
  });

  describe('when state is requested', () => {
    const getWrapperInRequestedState = props => getWrapper({
      reservation: { ...defaultProps.reservation, state: 'requested' },
      ...props,
    });

    test('show approve and deny button', () => {
      const wrapper = getWrapperInRequestedState();

      expect(findButtonByLabel(wrapper, 'approve').length).toEqual(1);
      expect(findButtonByLabel(wrapper, 'deny').length).toEqual(1);
    });
  });

  describe('when props.userCanCancel is true', () => {
    test('show cancel button', () => {
      const wrapper = getWrapper({ userCanCancel: true });

      expect(findButtonByLabel(wrapper, 'cancel').length).toEqual(1);
    });
  });
});
