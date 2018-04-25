import { expect } from 'chai';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import SearchControlOverlay from './SearchControlOverlay';

const defaults = {
  children: <div id="child-div" />,
  onHide: () => null,
  title: 'Test title',
};
function getWrapper(props) {
  return shallowWithIntl(<SearchControlOverlay {...defaults} {...props} />);
}

describe('pages/search/controls/SearchControlOverlay', () => {
  it('renders a div.app-SearchControlOverlay', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-SearchControlOverlay')).to.be.true;
  });

  it('renders a div.app-SearchControlOverlay__overlay', () => {
    const wrapper = getWrapper();
    const overlay = wrapper.find('.app-SearchControlOverlay__overlay');
    expect(overlay).to.have.length(1);
  });

  it('renders a div.app-SearchControlOverlay__content', () => {
    const wrapper = getWrapper();
    const content = wrapper.find('.app-SearchControlOverlay__content');
    expect(content).to.have.length(1);
  });

  it('renders a div.app-SearchControlOverlay__content', () => {
    const wrapper = getWrapper();
    const children = wrapper.find('#child-div');
    expect(children).to.have.length(1);
  });
});
