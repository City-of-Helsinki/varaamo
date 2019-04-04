import CONSTANTS from 'constants/AppConstants';

import React from 'react';
import simple from 'simple-mock';
import { shallow } from 'enzyme';

import SelectControl from './controls/SelectControl';
import { UnconnectedSort as Sort } from './Sort';

describe('pages/search/Sort', () => {
  const defaultProps = {
    t: () => 'label',
    lang: 'en',
    sortBy: () => 'people'
  };
  function getWrapper(props) {
    return shallow(<Sort {...defaultProps} {...props} />);
  }

  describe('render', () => {
    test('renders SelectControl for sort with correct props', () => {
      const wrapper = getWrapper({});
      const selectControl = wrapper.find(SelectControl);
      expect(selectControl).toHaveLength(1);
      expect(selectControl.prop('id')).toBe('app-Sort');
      expect(selectControl.prop('label')).toBeDefined();
      expect(selectControl.prop('onChange')).toBeDefined();
      expect(selectControl.prop('value')).toBeDefined();
    });
  });

  describe('handleChange', () => {
    test('calls this.props.onChange with correct value', () => {
      const sortBy = simple.mock();
      const instance = getWrapper({ sortBy }).instance();
      instance.handleChange({ value: CONSTANTS.SORT_BY_OPTIONS.PEOPLE });
      expect(sortBy.callCount).toBe(1);
      expect(sortBy.lastCall.args[0]).toEqual({ orderBy: CONSTANTS.SORT_BY_OPTIONS.PEOPLE });
    });
  });
});
