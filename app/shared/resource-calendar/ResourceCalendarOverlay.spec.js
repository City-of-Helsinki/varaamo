import { expect } from 'chai';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ResourceCalendarOverlay from './ResourceCalendarOverlay';

describe('shared/resource-calendar/ResourceCalendarOverlay', () => {
  function getWrapper(props) {
    return shallowWithIntl(
      <ResourceCalendarOverlay {...props} />
    );
  }

  it('renders app-ResourceCalendarOverlay with correct children', () => {
    const children = '<div id="child-div" />';
    const wrapper = getWrapper({ children });
    const overlay = wrapper.find('.app-ResourceCalendarOverlay__overlay');
    const content = wrapper.find('.app-ResourceCalendarOverlay__content');

    expect(wrapper.length).to.equal(1);
    expect(overlay.length).to.equal(1);
    expect(content.length).to.equal(1);
    expect(wrapper.prop('className')).to.equal('app-ResourceCalendarOverlay');
    expect(content.children().equals(children)).to.be.true;
  });
});
