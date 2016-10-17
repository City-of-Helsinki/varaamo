import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Label from 'react-bootstrap/lib/Label';
import Immutable from 'seamless-immutable';

import constants from 'constants/AppConstants';
import Reservation from 'utils/fixtures/Reservation';
import ReservationStateLabel from './ReservationStateLabel';

describe('shared/reservation-state-label/ReservationStateLabel', () => {
  const defaultProps = {
    reservation: Immutable(Reservation.build({
      needManualConfirmation: true,
      state: 'confirmed',
    })),
  };

  function getWrapper(extraProps) {
    return shallow(<ReservationStateLabel {...defaultProps} {...extraProps} />);
  }

  function getTests(needManualConfirmation, state) {
    const reservation = Reservation.build({ needManualConfirmation, state });
    const wrapper = getWrapper({ reservation });

    it('renders a container div with correct className', () => {
      const container = wrapper.find('div');
      expect(container.length).to.equal(1);
      expect(container.prop('className')).to.equal('reservation-state-label-container');
    });

    describe('Label', () => {
      const label = wrapper.find(Label);
      const { labelBsStyle, labelText } = constants.RESERVATION_STATE_LABELS[reservation.state];

      it('is rendered', () => {
        expect(label.length).to.equal(1);
      });

      it('has correct bsStyle prop', () => {
        expect(label.prop('bsStyle')).to.equal(labelBsStyle);
      });

      it('has correct text', () => {
        expect(label.props().children).to.equal(labelText);
      });
    });
  }

  describe('if reservation needs manual confirmation', () => {
    const needManualConfirmation = true;

    describe('if reservation state is "cancelled"', () => {
      const state = 'cancelled';
      getTests(needManualConfirmation, state);
    });

    describe('if reservation state is "confirmed"', () => {
      const state = 'confirmed';
      getTests(needManualConfirmation, state);
    });

    describe('if reservation state is "denied"', () => {
      const state = 'denied';
      getTests(needManualConfirmation, state);
    });

    describe('if reservation state is "requested"', () => {
      const state = 'requested';
      getTests(needManualConfirmation, state);
    });
  });

  describe('if reservation does not need manual confirmation', () => {
    const needManualConfirmation = false;

    describe('if reservation state is "cancelled"', () => {
      const state = 'cancelled';
      getTests(needManualConfirmation, state);
    });

    describe('if reservation state is "confirmed"', () => {
      const state = 'confirmed';

      it('renders an empty span', () => {
        const reservation = Reservation.build({ needManualConfirmation, state });
        const wrapper = getWrapper({ reservation });
        expect(wrapper.equals(<span />)).to.be.true;
      });
    });

    describe('if reservation state is "denied"', () => {
      const state = 'denied';

      it('renders an empty span', () => {
        const reservation = Reservation.build({ needManualConfirmation, state });
        const wrapper = getWrapper({ reservation });
        expect(wrapper.equals(<span />)).to.be.true;
      });
    });

    describe('if reservation state is "requested"', () => {
      const state = 'requested';

      it('renders an empty span', () => {
        const reservation = Reservation.build({ needManualConfirmation, state });
        const wrapper = getWrapper({ reservation });
        expect(wrapper.equals(<span />)).to.be.true;
      });
    });
  });
});
