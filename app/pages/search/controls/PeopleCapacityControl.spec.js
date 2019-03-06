import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import PeopleCapacityControl from './PeopleCapacityControl';
import SearchControlOverlay from './SearchControlOverlay';

function getWrapper(props) {
  const defaults = {
    onConfirm: () => null,
    value: 5,
  };
  return shallowWithIntl(<PeopleCapacityControl {...defaults} {...props} />);
}

describe('pages/search/controls/PeopleCapacityControl', () => {
  test('renders a div.app-PeopleCapacityControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PeopleCapacityControl')).to.be.true;
  });

  test('renders Button with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const button = wrapper.find(Button);
    expect(button).to.have.length(1);
    expect(button.prop('className')).to.equal('app-PeopleCapacityControl__show-button');
    expect(button.prop('onClick')).to.equal(instance.showOverlay);
  });

  test('renders Overlay with correct props', () => {
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

  test('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const controlOverlay = wrapper.find(SearchControlOverlay);
    expect(controlOverlay).to.have.length(1);
    expect(controlOverlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
    expect(controlOverlay.prop('title')).to.equal('PeopleCapacityControl.header');
  });

  test('renders ListGroup with correct props', () => {
    const wrapper = getWrapper();
    const listGroup = wrapper.find(ListGroup);
    expect(listGroup).to.have.length(1);
  });

  test('renders ListGroupItem with correct props', () => {
    const wrapper = getWrapper();
    const listGroupItems = wrapper.find(ListGroupItem);
    expect(listGroupItems).to.have.length(14);
  });

  describe('handleConfirm', () => {
    test('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = 12;
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });

    test('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).to.equal(1);
      simple.restore();
    });
  });

  describe('hideOverlay', () => {
    test('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('showOverlay', () => {
    test('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).to.be.true;
    });
  });
});
