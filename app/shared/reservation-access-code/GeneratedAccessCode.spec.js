import React from 'react';

import { shallowWithIntl } from '../../utils/testUtils';
import GeneratedAccessCode from './GeneratedAccessCode';

describe('shared/reservation-access-code/GeneratedAccessCode', () => {
  const defaultProps = {
    accessCode: '1234',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<GeneratedAccessCode {...defaultProps} {...extraProps} />);
  }

  test('renders a span with correct class', () => {
    const span = getWrapper().find('span');
    expect(span.length).toBe(1);
    expect(span.prop('className')).toBe('reservation-access-code');
  });

  test('renders the reservation access code', () => {
    const content = getWrapper().text();
    expect(content).toContain('1234');
  });

  test('renders text given in props', () => {
    const text = 'Some text';
    const content = getWrapper({ text }).text();
    expect(content).toContain(text);
  });

  test('renders default text if no text is given in props', () => {
    const content = getWrapper().text();
    expect(content).toContain('ReservationAccessCode.defaultText');
  });
});
