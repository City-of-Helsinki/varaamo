import React from 'react';
import Toggle from 'react-toggle';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../utils/testUtils';
import CheckboxControl from './CheckboxControl';

const defaults = {
  id: 'some-id',
  label: 'some-label',
  onConfirm: () => null,
  value: true,
};
function getWrapper(props) {
  return shallowWithIntl(<CheckboxControl {...defaults} {...props} />);
}

describe('pages/search/controls/CheckboxControl', () => {
  test('renders a div.app-CheckboxControl', () => {
    const wrapper = getWrapper({});
    expect(wrapper.is('div.app-CheckboxControl')).toBe(true);
  });

  test('renders a Toggle with correct props', () => {
    const toggle = getWrapper({}).find(Toggle);
    expect(toggle).toHaveLength(1);
    expect(toggle.prop('defaultChecked')).toBe(defaults.value);
    expect(typeof toggle.prop('onChange')).toBe('function');
  });

  test('Checkbox onChange calls prop onConfirm', () => {
    const onConfirm = simple.mock();
    const mockEvent = {
      target: {
        checked: true,
      },
    };
    const toggle = getWrapper({ onConfirm }).find(Toggle);
    expect(toggle).toHaveLength(1);
    toggle.prop('onChange')(mockEvent);
    expect(onConfirm.callCount).toBe(1);
    expect(onConfirm.lastCall.args).toEqual([true]);
  });
});
