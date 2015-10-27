import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import ReservationFormControls from 'components/reservation/ReservationFormControls';

function getProps(props) {
  const defaults = {
    disabled: false,
    isEditing: false,
    isMakingReservations: false,
    onCancel: simple.stub(),
    onClick: simple.stub(),
  };

  return Object.assign({}, defaults, props);
}

describe('Component: reservation/ReservationFormControls', () => {
  describe('when user is not editing reservations', () => {
    const props = getProps();
    const tree = sd.shallowRender(<ReservationFormControls {...props} />);

    it('should render one button', () => {
      const buttonTrees = tree.everySubTree('Button');

      expect(buttonTrees.length).to.equal(1);
    });

    it('should pass correct props to the button', () => {
      const actualProps = tree.subTree('Button').props;

      expect(actualProps.disabled).to.equal(props.disabled);
      expect(actualProps.onClick).to.equal(props.onClick);
    });

    it('the button should have text "Varaa"', () => {
      expect(tree.subTree('Button').props.children).to.equal('Varaa');
    });
  });

  describe('when user is editing reservations', () => {
    const props = getProps({
      isEditing: true,
    });
    const tree = sd.shallowRender(<ReservationFormControls {...props} />);
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
        expect(buttonTree.props.disabled).to.equal(props.disabled);
        expect(buttonTree.props.onClick).to.equal(props.onClick);
      });
    });

    describe('the second button', () => {
      const buttonTree = buttonTrees[1];

      it('should be a cancel button', () => {
        expect(buttonTree.props.children).to.equal('Peruuta');
      });

      it('should have correct props', () => {
        expect(buttonTree.props.onClick).to.equal(props.onCancel);
      });
    });
  });
});
