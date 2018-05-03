import { expect } from 'chai';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import SearchBox from './SearchBox';
import SearchControlOverlay from './SearchControlOverlay';

describe('pages/search/controls/SearchBox', () => {
  const defaults = {
    onChange: () => null,
    onSearch: () => null,
    options: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
    value: 'meeting room',
  };

  function getWrapper(props) {
    return shallowWithIntl(<SearchBox {...defaults} {...props} />);
  }

  it('renders a form.app-SearchBox', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('form.app-SearchBox')).to.be.true;
  });

  it('renders ControlLabel', () => {
    const controlLabel = getWrapper().find(ControlLabel);
    expect(controlLabel).to.have.length(1);
  });

  it('renders FormControl with correct props', () => {
    const value = 'some search query';
    const wrapper = getWrapper({ value });
    const formControl = wrapper.find(FormControl);
    expect(formControl).to.have.length(1);
    expect(formControl.prop('onChange')).to.equal(wrapper.instance().handleChange);
    expect(formControl.prop('type')).to.equal('text');
    expect(formControl.prop('value')).to.equal(value);
  });

  it('renders Overlay with correct props', () => {
    const wrapper = getWrapper();
    const overlay = wrapper.find(Overlay);
    expect(overlay).to.have.length(1);
    expect(overlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
    expect(overlay.prop('show')).to.be.false;
  });

  it('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const overlay = wrapper.find(SearchControlOverlay);
    expect(overlay).to.have.length(1);
    expect(overlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
  });

  it('renders ListGroup', () => {
    const wrapper = getWrapper();
    const listGroup = wrapper.find(ListGroup);
    expect(listGroup).to.have.length(1);
  });

  it('does not render ListGroupItems by default', () => {
    const wrapper = getWrapper();
    const listGroupItem = wrapper.find(ListGroupItem);
    expect(listGroupItem).to.have.length(0);
  });

  describe('handleSelect', () => {
    it('calls props.onChange', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const value = 'Label 1';
      instance.state.searchOptions = defaults.options;
      instance.state.visible = true;
      instance.handleSelect(value);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([value]);
      expect(instance.state.searchOptions).to.deep.equal([]);
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('handleSubmit', () => {
    it('calls props.onSearch', () => {
      const mockEvent = { preventDefault: () => null };
      const onSearch = simple.mock();
      const instance = getWrapper({ onSearch }).instance();
      instance.handleSubmit(mockEvent);
      expect(onSearch.callCount).to.equal(1);
    });

    it('calls event.preventDefault', () => {
      const mockEvent = { preventDefault: simple.mock() };
      const instance = getWrapper().instance();
      instance.handleSubmit(mockEvent);
      expect(mockEvent.preventDefault.callCount).to.equal(1);
    });
  });

  describe('handleChange', () => {
    it('calls this.props.onChange with correct value', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const mockEvent = { target: { value: 'some value' } };
      instance.handleChange(mockEvent);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([mockEvent.target.value]);
    });

    it('finds correct options and shows results as ListGroupItems', () => {
      const instance = getWrapper().instance();
      const mockEvent = { target: { value: 'Label' } };
      instance.handleChange(mockEvent);
      expect(instance.state.searchOptions).to.have.length(2);
      expect(instance.state.searchOptions).to.deep.equal(defaults.options);
      expect(instance.state.visible).to.be.true;
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
