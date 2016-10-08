import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Resource from 'fixtures/Resource';
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

describe('screens/resource/reservation-calendar/ReservationCalendarControls', () => {
  describe('when user is not editing reservations', () => {
    const props = getProps();
    const tree = sd.shallowRender(<ReservationCalendarControls {...props} />);
    const instance = tree.getMountedInstance();

    it('should render one button', () => {
      const buttonTrees = tree.everySubTree('Button');

      expect(buttonTrees.length).to.equal(1);
    });

    it('should pass correct props to the button', () => {
      const actualProps = tree.subTree('Button').props;

      expect(actualProps.onClick).to.equal(instance.handleMainClick);
    });

    it('the button should have text "Varaa"', () => {
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

    it('should render two buttons', () => {
      expect(buttonTrees.length).to.equal(2);
    });

    describe('the first button', () => {
      const buttonTree = buttonTrees[0];

      it('should be a confirm edit button', () => {
        expect(buttonTree.props.children).to.equal('Vahvista muutokset');
      });

      it('should have correct props', () => {
        expect(buttonTree.props.onClick).to.equal(instance.handleMainClick);
      });
    });

    describe('the second button', () => {
      const buttonTree = buttonTrees[1];

      it('should be a cancel button', () => {
        expect(buttonTree.props.children).to.equal('Takaisin');
      });

      it('should have correct props', () => {
        expect(buttonTree.props.onClick).to.equal(props.onCancel);
      });
    });
  });
});
