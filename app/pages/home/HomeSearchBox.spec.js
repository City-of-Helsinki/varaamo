import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import HomeSearchBox from './HomeSearchBox';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    onSearch: () => null,
    value: 'meeting room',
  };
  return shallowWithIntl(<HomeSearchBox {...defaults} {...props} />);
}

describe('pages/home/HomeSearchBox', () => {
  test('renders a form.app-HomeSearchBox', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('form.app-HomeSearchBox')).toBe(true);
  });

  test('renders FormControl with correct props', () => {
    const value = 'some search query';
    const wrapper = getWrapper({ value });
    const formControl = wrapper.find(FormControl);
    expect(formControl).toHaveLength(1);
    expect(formControl.prop('onChange')).toBe(wrapper.instance().handleChange);
    expect(formControl.prop('type')).toBe('text');
    expect(formControl.prop('placeholder')).toBe('HomeSearchBox.searchPlaceholder');
  });

  test('renders search button', () => {
    const button = getWrapper().find(Button);
    expect(button).toHaveLength(1);
    expect(button.prop('children')).toBe('HomeSearchBox.buttonText');
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
      const instance = getWrapper().instance();
      const mockEvent = { preventDefault: simple.mock(), target: { value: 'some value' } };
      instance.handleChange(mockEvent);
      expect(instance.state.value).toBe(mockEvent.target.value);
    });
  });
});
