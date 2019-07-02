import React from 'react';

import { mountWithIntl } from '../../../../utils/testUtils';
import ReservationPhases from '../ReservationPhases';
import ProgressSteps from '../../../../shared/progress-steps/ProgressSteps';
import Step from '../../../../shared/progress-steps/Step';

describe('pages/reservation/reservation-phases/ReservationPhases', () => {
  const defaultProps = {
    currentPhase: 'information',
    isEditing: false,
    resource: null,
  };

  function getWrapper(extraProps) {
    return mountWithIntl(<ReservationPhases {...defaultProps} {...extraProps} />);
  }

  test('uses ProgressSteps under the hood', () => {
    const wrapper = getWrapper();
    const progressStepsComponent = wrapper.find(ProgressSteps);
    expect(progressStepsComponent).toHaveLength(1);
  });

  test('when not editing', () => {
    const wrapper = getWrapper();
    const steps = wrapper.find(Step);
    expect(steps).toHaveLength(2);
    expect(steps.at(0).prop('isActive')).toBe(true);
    expect(steps.at(1).prop('isActive')).toBe(false);
  });

  test('renders three phases when editing', () => {
    const wrapper = getWrapper({
      currentPhase: 'information',
      resource: null,
      isEditing: true,
    });
    const steps = wrapper.find(Step);
    expect(steps).toHaveLength(3);
    expect(steps.at(0).prop('isActive')).toBe(false);
    expect(steps.at(1).prop('isActive')).toBe(true);
    expect(steps.at(2).prop('isActive')).toBe(false);
    expect(steps.at(0).prop('label')).toBe('ReservationPhase.timeTitle');
  });

  test('renders payment phase when resource has products', () => {
    const wrapper = getWrapper({
      currentPhase: 'information',
      resource: {
        products: [{}],
      },
      isEditing: false,
    });
    const steps = wrapper.find(Step);
    expect(steps).toHaveLength(3);
    expect(steps.at(1).prop('label')).toBe('ReservationPhase.paymentTitle');
  });
});
