import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../utils/testUtils';
import UnconnectedInternalReservationForm from '../InternalReservationForm';

describe('pages/reservation/reservation-information/InternalReservationForm', () => {
  describe('validation', () => {
    const input = shallowWithIntl(<UnconnectedInternalReservationForm />).find('#internalReservationChecked');
    it('has input#internalReservationChecked', () => {
      expect(input).toHaveLength(1);
    });
    it('is checked', () => {
      expect(input.props().checked).toEqual(true);
    });
  });
  describe('rendering', () => {
    it('renders correctly', () => {
      const wrapper = shallowWithIntl(<UnconnectedInternalReservationForm />);
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
  });
});
