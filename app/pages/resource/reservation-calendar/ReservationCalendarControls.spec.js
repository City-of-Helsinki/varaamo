import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationCalendarControls from './ReservationCalendarControls';

function getWrapper(props) {
  const defaults = {
    addNotification: simple.stub(),
    isLoggedIn: true,
    disabled: false,
    isEditing: false,
    isMakingReservations: false,
    onCancel: simple.stub(),
    onClick: simple.stub(),
    resource: Resource.build(),
  };

  return shallowWithIntl(<ReservationCalendarControls {...defaults} {...props} />);
}

describe('pages/resource/reservation-calendar/ReservationCalendarControls', () => {
  describe('when user is not editing reservations', () => {
    function getIsNotEditingWrapper(props) {
      return getWrapper({ ...props, isEditing: false });
    }

    it('renders one button', () => {
      const buttons = getIsNotEditingWrapper().find(Button);
      expect(buttons).to.have.length(1);
    });

    it('passes correct onClick prop to the button', () => {
      const wrapper = getIsNotEditingWrapper();
      const actual = wrapper.find(Button).prop('onClick');
      expect(actual).to.equal(wrapper.instance().handleMainClick);
    });

    it('the button has correct text', () => {
      const button = getIsNotEditingWrapper().find(Button);
      expect(button.prop('children')).to.equal('ReservationCalendarControls.reserve');
    });
  });

  describe('when user is editing reservations', () => {
    function getIsEditingWrapper(props) {
      return getWrapper({ ...props, isEditing: true });
    }

    it('renders two buttons', () => {
      const buttons = getIsEditingWrapper().find(Button);
      expect(buttons).to.have.length(2);
    });

    it('the first button is a confirm edit button', () => {
      const wrapper = getIsEditingWrapper();
      const button = wrapper.find(Button).at(0);
      expect(button.prop('children')).to.equal('ReservationCalendarControls.confirmChanges');
      expect(button.prop('onClick')).to.equal(wrapper.instance().handleMainClick);
    });

    it('the second button is a cancel button', () => {
      const onCancel = () => null;
      const button = getIsEditingWrapper({ onCancel }).find(Button).at(1);
      expect(button.prop('children')).to.equal('ReservationCalendarControls.goBack');
      expect(button.prop('onClick')).to.equal(onCancel);
    });
  });
});
