import React from 'react';

import { shallowWithIntl } from '../../../utils/testUtils';
import ResourceCalendarOverlay from '../ResourceCalendarOverlay';

describe('shared/resource-calendar/ResourceCalendarOverlay', () => {
  function getWrapper(props) {
    return shallowWithIntl(<ResourceCalendarOverlay {...props} />);
  }

  test('renders app-ResourceCalendarOverlay with correct children', () => {
    const children = '<div id="child-div" />';
    const wrapper = getWrapper({ children });
    const overlay = wrapper.find('.app-ResourceCalendarOverlay__overlay');
    const content = wrapper.find('.app-ResourceCalendarOverlay__content');

    expect(wrapper.length).toBe(1);
    expect(overlay.length).toBe(1);
    expect(content.length).toBe(1);
    expect(wrapper.prop('className')).toBe('app-ResourceCalendarOverlay');
    expect(content.children().equals(children)).toBe(true);
  });
});
