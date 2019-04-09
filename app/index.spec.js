import React from 'react';

import BrowserWarning from './pages/browser-warning/BrowserWarning';
import { shallowWithIntl } from './utils/testUtils';

jest.mock('react-device-detect', () => ({ browserName: 'IE' }));

describe('app/index', () => {
  function getWrapper() {
    return shallowWithIntl(<BrowserWarning />);
  }

  test('renders BrowserWarning component correctly', () => {
    const warningComponent = getWrapper();
    expect(warningComponent.length).toBe(1);
  });
});
