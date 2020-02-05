import React from 'react';

import { shallowWithIntl } from '../../../utils/testUtils';
import AccessibilityShortcuts from '../AccessibilityShortcuts';

describe('<AccessibilityShortcuts />', () => {
  const mainContentId = 'main-content';
  const defaultProps = {
    mainContentId,
  };
  const getWrapper = props => shallowWithIntl(<AccessibilityShortcuts {...defaultProps} {...props} />);

  test('div container exists', () => {
    const element = getWrapper().find('div');
    expect(element).toHaveLength(1);
    expect(element.prop('className')).toBe('app-AccessibilityShortcuts');
  });

  describe('AccessibilityShortcuts', () => {
    let element;
    beforeAll(() => {
      element = getWrapper().find('a');
    });

    test('renders', () => {
      expect(element).toHaveLength(1);
    });

    test('renders with correct props', () => {
      expect(element.prop('className')).toBe('sr-only app-AccessibilityShortcuts__skip-link');
      expect(element.prop('href')).toBe(`#${mainContentId}`);
    });

    test('renders with text', () => {
      expect(element.text()).toBeDefined();
    });
  });
});
