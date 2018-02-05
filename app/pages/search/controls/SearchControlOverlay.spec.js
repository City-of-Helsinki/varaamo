import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

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

  it('renders a div.app-SearchControlOverlay__header', () => {
    const wrapper = getWrapper();
    const header = wrapper.find('.app-SearchControlOverlay__header');
    expect(header).to.have.length(1);
  });

  it('renders a h2 with correct title', () => {
    const wrapper = getWrapper();
    const title = wrapper.find('h2');
    expect(title).to.have.length(1);
    expect(title.text()).to.equal(defaults.title);
  });

  it('renders Button with correct props', () => {
    const wrapper = getWrapper();
    const button = wrapper.find(Button);
    expect(button).to.have.length(1);
    expect(button.prop('bsStyle')).to.equal('link');
    expect(button.prop('className')).to.equal('app-SearchControlOverlay__hide');
    expect(button.prop('onClick')).to.equal(defaults.onHide);
    expect(button.children().at(0).text()).to.equal('×');
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
