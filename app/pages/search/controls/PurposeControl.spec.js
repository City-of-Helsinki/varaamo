import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import PurposeControl from './PurposeControl';
import SearchControlOverlay from './SearchControlOverlay';

function getWrapper(props) {
  const defaults = {
    isLoading: false,
    onConfirm: () => null,
    purposeOptions: [],
    value: '',
  };
  return shallowWithIntl(<PurposeControl {...defaults} {...props} />);
}

describe('pages/search/controls/PurposeControl', () => {
  it('renders a div.app-PurposeControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PurposeControl')).to.be.true;
  });

  it('renders Button with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const button = wrapper.find(Button);
    expect(button).to.have.length(1);
    expect(button.prop('className')).to.equal('app-PurposeControl__show-button');
    expect(button.prop('onClick')).to.equal(instance.showOverlay);
  });

  it('renders Overlay with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const overlay = wrapper.find(Overlay);
    expect(overlay).to.have.length(1);
    expect(overlay.prop('container')).to.equal(instance);
    expect(overlay.prop('onHide')).to.equal(instance.hideOverlay);
    expect(overlay.prop('placement')).to.equal('bottom');
    expect(overlay.prop('rootClose')).to.be.true;
    expect(overlay.prop('show')).to.equal(instance.state.visible);
  });

  it('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const controlOverlay = wrapper.find(SearchControlOverlay);
    expect(controlOverlay).to.have.length(1);
    expect(controlOverlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
    expect(controlOverlay.prop('title')).to.equal('PurposeControl.label');
  });

  it('renders ListGroup with correct props', () => {
    const wrapper = getWrapper();
    const listGroup = wrapper.find(ListGroup);
    expect(listGroup).to.have.length(1);
  });

  it('renders ListGroupItem with correct props', () => {
    const wrapper = getWrapper();
    const listGroupItems = wrapper.find(ListGroupItem);
    expect(listGroupItems).to.have.length(1);
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = 'meeting';
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });

    it('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).to.equal(1);
      simple.restore();
    });
  });

  describe('hideOverlay', () => {
    it('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('showOverlay', () => {
    it('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).to.be.true;
    });
  });
});
