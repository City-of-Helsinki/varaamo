import React from 'react';
import simple from 'simple-mock';
import toJson from 'enzyme-to-json';

import HomeSearchBox from '../HomeSearchBox';
import { shallowWithIntl } from '../../../../app/utils/testUtils';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    onSearch: () => null,
    value: 'meeting room',
  };
  return shallowWithIntl(<HomeSearchBox {...defaults} {...props} />);
}

describe('pages/home/HomeSearchBox', () => {
  test('render normally', () => {
    const wrapper = getWrapper();

    expect(toJson(wrapper)).toMatchSnapshot();
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
