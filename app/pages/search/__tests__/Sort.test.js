import React from 'react';
import { shallow } from 'enzyme';

import SelectControl from '../controls/SelectControl';
import { UnconnectedSort as Sort } from '../Sort';

describe('pages/search/Sort', () => {
  const defaultProps = {
    sortValue: '',
    t: value => value,
    lang: 'en',
    onChange: () => {},
  };

  function getWrapper(props) {
    return shallow(<Sort {...defaultProps} {...props} />);
  }

  describe('pages/search/Sort', () => {
    test('renders SelectControl for sort with correct props', () => {
      const wrapper = getWrapper({});
      const selectControl = wrapper.find(SelectControl);
      expect(selectControl).toHaveLength(1);
      expect(selectControl.prop('id')).toBe('app-Sort');
      expect(selectControl.prop('label')).toEqual('SortBy.label');
      expect(selectControl.prop('onChange')).toBeDefined();
      expect(selectControl.prop('options')).toBeDefined();
      expect(selectControl.prop('value')).toEqual(defaultProps.sortValue);
    });

    test('get translated options base on language', () => {
      const wrapper = getWrapper({ lang: 'foo' });
      const options = wrapper.prop('options');

      expect(options.length).toEqual(4);
      expect(options[0].value).toContain('foo');
      expect(options[3].value).not.toContain('foo');
    });
  });
});
