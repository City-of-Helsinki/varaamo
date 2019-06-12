import React from 'react';
import { shallow } from 'enzyme';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

import FAIcon from '../FontAwesomeIcon';

describe('FontAwesome icon', () => {
  function getWrapper(props) {
    return shallow(<FAIcon {...props} />);
  }

  test('render normally without icon props', () => {
    const wrapper = getWrapper();

    expect(wrapper).toBeDefined();
    expect(wrapper.length).toEqual(1);
  });

  test('render FontAwesomeIcon component', () => {
    const wrapper = getWrapper({ icon: 'users' });
    const icon = wrapper.find(Icon);

    expect(icon).toBeDefined();
    expect(icon.length).toEqual(1);
    expect(icon.prop('icon')).toEqual('users');
    expect(icon.find('svg')).toBeDefined();
  });

  test('have all passed prop down FontAwesome component', () => {
    const wrapper = getWrapper({ foo: 'bar' });

    expect(wrapper.find(Icon).prop('foo')).toEqual('bar');
  });

  test('have default className as app-fontAwesome', () => {
    const wrapper = getWrapper();
    const expected = 'app-fontAwesome';

    expect(wrapper.prop('className')).toBeDefined();
    expect(wrapper.prop('className')).toEqual(expected);
  });

  test('have default className as app-fontAwesome, join with className as props', () => {
    const wrapper = getWrapper({ className: 'foo' });
    const expected = 'app-fontAwesome foo';

    expect(wrapper.prop('className')).toBeDefined();
    expect(wrapper.prop('className')).toEqual(expected);
  });
});
