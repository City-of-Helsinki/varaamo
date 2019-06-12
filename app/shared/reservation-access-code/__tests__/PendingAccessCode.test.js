import React from 'react';

import { shallowWithIntl } from '../../../utils/testUtils';
import PendingAccessCode from '../PendingAccessCode';

describe('shared/reservation-access-code/PendingAccessCode', () => {
  function getWrapper(extraProps) {
    return shallowWithIntl(<PendingAccessCode {...extraProps} />);
  }

  test('renders PIN-code pending text', () => {
    const wrapper = getWrapper();
    expect(wrapper.text()).toContain('ReservationAccessCode.pending');
  });
});
