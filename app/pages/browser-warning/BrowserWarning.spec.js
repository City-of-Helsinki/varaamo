import React from 'react';

import BrowserWarning from './BrowserWarning';
import { shallowWithIntl } from 'utils/testUtils';

describe('pages/browser-warning/BrowserWarning', () => {
  function getWrapper() {
    return shallowWithIntl(<BrowserWarning />);
  }

  test('renders a browser warning div', () => {
    const div = getWrapper().find('div');
    expect(div.length).toBe(1);
  });

  test('renders a browser warning paragraph', () => {
    const p = getWrapper().find('p');
    expect(p.length).toBe(2);
  });

  test('renders all specified browser links', () => {
    const a = getWrapper().find('a');
    expect(a.length).toBe(6);
  });
});
