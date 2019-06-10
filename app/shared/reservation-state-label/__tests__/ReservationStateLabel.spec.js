import React from 'react';
import Immutable from 'seamless-immutable';

import constants from '../../../constants/AppConstants';
import Label from '../../label';
import Reservation from '../../../utils/fixtures/Reservation';
import { shallowWithIntl } from '../../../utils/testUtils';
import ReservationStateLabel from '../ReservationStateLabel';

describe('shared/reservation-state-label/ReservationStateLabel', () => {
  const defaultProps = {
    reservation: Immutable(Reservation.build({
      needManualConfirmation: true,
      state: 'confirmed',
    })),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationStateLabel {...defaultProps} {...extraProps} />);
  }

  function getTests(needManualConfirmation, state) {
    const reservation = Reservation.build({ needManualConfirmation, state });
    const wrapper = getWrapper({ reservation });

    test('renders a container div with correct className', () => {
      const container = wrapper.find('div');
      expect(container.length).toBe(1);
      expect(container.prop('className')).toBe('reservation-state-label-container');
    });

    describe('Label', () => {
      const label = wrapper.find(Label);
      const { labelBsStyle, labelTextId } = constants.RESERVATION_STATE_LABELS[reservation.state];

      test('is rendered', () => {
        expect(label.length).toBe(1);
      });

      test('has correct bsStyle prop', () => {
        expect(label.prop('bsStyle')).toBe(labelBsStyle);
      });

      test('has correct text', () => {
        expect(label.prop('children')).toBe(labelTextId);
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

      test('renders an empty span', () => {
        const reservation = Reservation.build({ needManualConfirmation, state });
        const wrapper = getWrapper({ reservation });
        expect(wrapper.equals(<span />)).toBe(true);
      });
    });

    describe('if reservation state is "denied"', () => {
      const state = 'denied';

      test('renders an empty span', () => {
        const reservation = Reservation.build({ needManualConfirmation, state });
        const wrapper = getWrapper({ reservation });
        expect(wrapper.equals(<span />)).toBe(true);
      });
    });

    describe('if reservation state is "requested"', () => {
      const state = 'requested';

      test('renders an empty span', () => {
        const reservation = Reservation.build({ needManualConfirmation, state });
        const wrapper = getWrapper({ reservation });
        expect(wrapper.equals(<span />)).toBe(true);
      });
    });
  });
});
