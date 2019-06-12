import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../../utils/testUtils';
import SearchBox from '../SearchBox';
import SearchControlOverlay from '../SearchControlOverlay';

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

  test('renders a form.app-SearchBox', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('form.app-SearchBox')).toBe(true);
  });

  test('renders ControlLabel', () => {
    const controlLabel = getWrapper().find(ControlLabel);
    expect(controlLabel).toHaveLength(1);
  });

  test('renders FormControl with correct props', () => {
    const value = 'some search query';
    const wrapper = getWrapper({ value });
    const formControl = wrapper.find(FormControl);
    expect(formControl).toHaveLength(1);
    expect(formControl.prop('onChange')).toBe(wrapper.instance().handleChange);
    expect(formControl.prop('type')).toBe('text');
    expect(formControl.prop('value')).toBe(value);
  });

  test('renders Overlay with correct props', () => {
    const wrapper = getWrapper();
    const overlay = wrapper.find(Overlay);
    expect(overlay).toHaveLength(1);
    expect(overlay.prop('onHide')).toBe(wrapper.instance().hideOverlay);
    expect(overlay.prop('show')).toBe(false);
  });

  test('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const overlay = wrapper.find(SearchControlOverlay);
    expect(overlay).toHaveLength(1);
    expect(overlay.prop('onHide')).toBe(wrapper.instance().hideOverlay);
  });

  test('renders ListGroup', () => {
    const wrapper = getWrapper();
    const listGroup = wrapper.find(ListGroup);
    expect(listGroup).toHaveLength(1);
  });

  test('does not render ListGroupItems by default', () => {
    const wrapper = getWrapper();
    const listGroupItem = wrapper.find(ListGroupItem);
    expect(listGroupItem).toHaveLength(0);
  });

  describe('handleSelect', () => {
    test('calls props.onChange', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const value = 'Label 1';
      instance.state.searchOptions = defaults.options;
      instance.state.visible = true;
      instance.handleSelect(value);
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.args).toEqual([value]);
      expect(instance.state.searchOptions).toEqual([]);
      expect(instance.state.visible).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    test('calls props.onSearch', () => {
      const mockEvent = { preventDefault: () => null };
      const onSearch = simple.mock();
      const instance = getWrapper({ onSearch }).instance();
      instance.handleSubmit(mockEvent);
      expect(onSearch.callCount).toBe(1);
    });

    test('calls event.preventDefault', () => {
      const mockEvent = { preventDefault: simple.mock() };
      const instance = getWrapper().instance();
      instance.handleSubmit(mockEvent);
      expect(mockEvent.preventDefault.callCount).toBe(1);
    });
  });

  describe('handleChange', () => {
    test('calls this.props.onChange with correct value', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const mockEvent = { target: { value: 'some value' } };
      instance.handleChange(mockEvent);
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.args).toEqual([mockEvent.target.value]);
    });

    test('finds correct options and shows results as ListGroupItems', () => {
      const instance = getWrapper().instance();
      const mockEvent = { target: { value: 'Label' } };
      instance.handleChange(mockEvent);
      expect(instance.state.searchOptions).toHaveLength(2);
      expect(instance.state.searchOptions).toEqual(defaults.options);
      expect(instance.state.visible).toBe(true);
    });
  });

  describe('hideOverlay', () => {
    test('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).toBe(false);
    });
  });

  describe('showOverlay', () => {
    test('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).toBe(true);
    });
  });
});
