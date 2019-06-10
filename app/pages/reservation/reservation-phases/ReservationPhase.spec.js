import React from 'react';

import { shallowWithIntl } from '../../../utils/testUtils';
import ReservationPhase from './ReservationPhase';

describe('pages/reservation/reservation-phases/ReservationPhase', () => {
  const defaultProps = {
    cols: 6,
    isActive: false,
    isCompleted: false,
    index: 1,
    title: 'some title',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationPhase {...defaultProps} {...extraProps} />);
  }

  test('renders with correct col-sm- className', () => {
    const col = getWrapper({ cols: 6 }).find('.col-sm-6');
    expect(col).toHaveLength(1);
  });

  test(
    'renders with app-ReservationPage__phase-active className when isActive true',
    () => {
      const active = getWrapper({
        isActive: true,
      }).find('.app-ReservationPage__phase-active');
      expect(active).toHaveLength(1);
    }
  );

  test(
    'does not render app-ReservationPage__phase-active className when isActive false',
    () => {
      const active = getWrapper({
        isActive: false,
      }).find('.app-ReservationPage__phase-active');
      expect(active).toHaveLength(0);
    }
  );

  test(
    'renders with app-ReservationPage__phase-completed className when isCompleted true',
    () => {
      const completed = getWrapper({
        isCompleted: true,
      }).find('.app-ReservationPage__phase-completed');
      expect(completed).toHaveLength(1);
    }
  );

  test(
    'does not render app-ReservationPage__phase-completed className when isCompleted false',
    () => {
      const completed = getWrapper({
        isCompleted: false,
      }).find('.app-ReservationPage__phase-completed');
      expect(completed).toHaveLength(0);
    }
  );

  test('renders with correct index', () => {
    const index = getWrapper({
      index: 3,
    }).find('.app-ReservationPage__phase-index');
    expect(index).toHaveLength(1);
    expect(index.props().children).toBe(3);
  });
});
