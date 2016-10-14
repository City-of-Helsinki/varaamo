import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import ReservationCalendarControls from './ReservationCalendarControls';

function getProps(props) {
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

  return Object.assign({}, defaults, props);
}

describe('pages/resource/reservation-calendar/ReservationCalendarControls', () => {
  describe('when user is not editing reservations', () => {
    const props = getProps();
    const tree = sd.shallowRender(<ReservationCalendarControls {...props} />);
    const instance = tree.getMountedInstance();

    it('renders one button', () => {
      const buttonTrees = tree.everySubTree('Button');

      expect(buttonTrees.length).to.equal(1);
    });

    it('passes correct props to the button', () => {
      const actualProps = tree.subTree('Button').props;

      expect(actualProps.onClick).to.equal(instance.handleMainClick);
    });

    it('the button has text "Varaa"', () => {
      expect(tree.subTree('Button').props.children).to.equal('Varaa');
    });
  });

  describe('when user is editing reservations', () => {
    const props = getProps({
      isEditing: true,
    });
    const tree = sd.shallowRender(<ReservationCalendarControls {...props} />);
    const instance = tree.getMountedInstance();
    const buttonTrees = tree.everySubTree('Button');

    it('renders two buttons', () => {
      expect(buttonTrees.length).to.equal(2);
    });

    describe('the first button', () => {
      const buttonTree = buttonTrees[0];

      it('is a confirm edit button', () => {
        expect(buttonTree.props.children).to.equal('Vahvista muutokset');
      });

      it('has correct props', () => {
        expect(buttonTree.props.onClick).to.equal(instance.handleMainClick);
      });
    });

    describe('the second button', () => {
      const buttonTree = buttonTrees[1];

      it('is a cancel button', () => {
        expect(buttonTree.props.children).to.equal('Takaisin');
      });

      it('has correct props', () => {
        expect(buttonTree.props.onClick).to.equal(props.onCancel);
      });
    });
  });
});
