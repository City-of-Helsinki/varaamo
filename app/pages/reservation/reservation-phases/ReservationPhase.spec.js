import { expect } from 'chai';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
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

  it('renders with correct col-sm- className', () => {
    const col = getWrapper({ cols: 6 }).find('.col-sm-6');
    expect(col).to.have.length(1);
  });

  it('renders with app-ReservationPage__phase-active className when isActive true', () => {
    const active = getWrapper({
      isActive: true,
    }).find('.app-ReservationPage__phase-active');
    expect(active).to.have.length(1);
  });

  it('does not render app-ReservationPage__phase-active className when isActive false', () => {
    const active = getWrapper({
      isActive: false,
    }).find('.app-ReservationPage__phase-active');
    expect(active).to.have.length(0);
  });

  it('renders with app-ReservationPage__phase-completed className when isCompleted true', () => {
    const completed = getWrapper({
      isCompleted: true,
    }).find('.app-ReservationPage__phase-completed');
    expect(completed).to.have.length(1);
  });

  it('does not render app-ReservationPage__phase-completed className when isCompleted false', () => {
    const completed = getWrapper({
      isCompleted: false,
    }).find('.app-ReservationPage__phase-completed');
    expect(completed).to.have.length(0);
  });

  it('renders with correct index', () => {
    const index = getWrapper({
      index: 3,
    }).find('.app-ReservationPage__phase-index');
    expect(index).to.have.length(1);
    expect(index.props().children).to.equal(3);
  });
});
