import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import { shallow } from 'enzyme';

import { Button } from 'react-bootstrap';
import Immutable from 'seamless-immutable';

import TimeSlotControls from 'components/reservation/TimeSlotControls';
import Reservation from 'fixtures/Reservation';

describe('Component: reservation/TimeSlotControls', () => {
  const defaultProps = {
    onDeleteClick: simple.stub(),
    onEditClick: simple.stub(),
    reservation: Immutable(Reservation.build()),
  };

  function getWrapper(extraProps = {}) {
    const props = Object.assign({}, defaultProps, extraProps);
    return shallow(<TimeSlotControls {...props} />);
  }

  describe('if reservation is a regular reservation', () => {
    const buttons = getWrapper().find(Button);

    it('should render two buttons', () => {
      expect(buttons.length).to.equal(2);
    });

    describe('the first button', () => {
      const button = buttons.at(0);

      it('should be an edit button', () => {
        expect(button.props().children).to.equal('Muokkaa');
      });

      it('clicking the button should call props.onEditClick', () => {
        button.props().onClick();

        expect(defaultProps.onEditClick.callCount).to.equal(1);
      });
    });

    describe('the second button', () => {
      const button = buttons.at(1);

      it('should be a delete button', () => {
        expect(button.props().children).to.equal('Poista');
      });

      it('clicking the button should call props.onDeleteClick', () => {
        button.props().onClick();

        expect(defaultProps.onDeleteClick.callCount).to.equal(1);
      });
    });
  });

  describe('if reservation is a preliminary reservation', () => {
    const reservation = Reservation.build({ needManualConfirmation: true });
    const buttons = getWrapper({ reservation }).find(Button);

    it('should render one button', () => {
      expect(buttons.length).to.equal(1);
    });

    describe('the button', () => {
      const button = buttons.at(0);

      it('should be an info button', () => {
        expect(button.props().children).to.equal('Tiedot');
      });
    });
  });
});
