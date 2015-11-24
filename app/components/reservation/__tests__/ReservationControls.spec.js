import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import ReservationControls from 'components/reservation/ReservationControls';
import Reservation from 'fixtures/Reservation';

describe('Component: reservation/ReservationControls', () => {
  const props = {
    onDeleteClick: simple.stub(),
    onEditClick: simple.stub(),
    reservation: Immutable(Reservation.build()),
  };
  const tree = sd.shallowRender(<ReservationControls {...props} />);
  const buttonTrees = tree.everySubTree('Button');


  it('should render two buttons', () => {
    expect(buttonTrees.length).to.equal(2);
  });

  describe('the first button', () => {
    const buttonTree = buttonTrees[0];

    it('should be an edit button', () => {
      expect(buttonTree.props.children).to.equal('Muokkaa');
    });

    it('clicking the button should call props.onEditClick', () => {
      buttonTree.props.onClick();

      expect(props.onEditClick.callCount).to.equal(1);
    });
  });

  describe('the second button', () => {
    const buttonTree = buttonTrees[1];

    it('should be a delete button', () => {
      expect(buttonTree.props.children).to.equal('Poista');
    });

    it('clicking the button should call props.onDeleteClick', () => {
      buttonTree.props.onClick();

      expect(props.onDeleteClick.callCount).to.equal(1);
    });
  });
});
