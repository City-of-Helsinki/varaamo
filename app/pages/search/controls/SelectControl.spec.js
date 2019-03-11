import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import SelectControl from './SelectControl';

const defaults = {
  id: 'some-id',
  name: 'some-name',
  isLoading: false,
  label: 'some-label',
  onChange: () => null,
  options: [
    { value: 'filter-1', label: 'Label 1' },
    { value: 'filter-2', label: 'Label 2' },
  ],
  value: 'filter-1',
};
function getWrapper(props) {
  return shallowWithIntl(<SelectControl {...defaults} {...props} />);
}

describe('pages/search/controls/SelectControl', () => {
  afterEach(() => {
    simple.restore();
  });

  test('renders a div.app-SelectControl', () => {
    const wrapper = getWrapper({});
    expect(wrapper.is('div.app-SelectControl')).toBe(true);
  });

  test('renders a FormGroup with correct props', () => {
    const formGroup = getWrapper({}).find(FormGroup);
    expect(formGroup).toHaveLength(1);
    expect(formGroup.prop('controlId')).toBe(defaults.id);
  });

  test('renders a ControlLabel', () => {
    const controlLabel = getWrapper({}).find(ControlLabel);
    expect(controlLabel).toHaveLength(1);
  });

  test('hide Select when isLoading=true', () => {
    const select = getWrapper({ isLoading: true }).find(Select);

    expect(select).toHaveLength(0);
  });

  test('disable Select when isDisable was true', () => {
    const select = getWrapper({ isDisable: true }).find(Select);

    expect(select.prop('isDisable')).toBe(true);
  });

  test('renders a Select with correct props', () => {
    const select = getWrapper({}).find(Select);
    expect(select).toHaveLength(1);
    expect(select.prop('isClearable')).toBe(true);
    expect(select.prop('id')).toBe(defaults.id);
    expect(select.prop('name')).toBe(defaults.name);
    expect(typeof select.prop('onChange')).toBe('function');
    expect(select.prop('placeholder')).toBe('common.select');
    expect(select.prop('isSearchable')).toBe(true);
    expect(select.prop('value')).toBe(defaults.options[0]);
  });

  test(
    'renders a Select with props className contain app-Select, so the styling will work',
    () => {
      const select = getWrapper({ className: 'foo' }).find(Select);
      const defaultSelect = getWrapper().find(Select);

      expect(select).toHaveLength(1);
      expect(select.prop('className')).toContain('app-Select');
      expect(select.prop('className')).toContain('foo');
      expect(defaultSelect.prop('className')).toContain('app-Select');
    }
  );

  test('Select onChange calls prop onChange', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange }).find(Select);
    expect(select).toHaveLength(1);
    select.prop('onChange')(defaults.options[1], {});
    expect(onChange.callCount).toBe(1);
    expect(onChange.lastCall.args[0]).toEqual(defaults.options[1]);
  });

  test(
    'Select onChange calls prop onChange when clear multi selected field',
    () => {
      const onChange = simple.mock();
      const multiSelect = getWrapper({ onChange, isMulti: true }).find(Select);
      expect(multiSelect).toHaveLength(1);
      multiSelect.prop('onChange')(defaults.options, { action: 'clear' });
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.args[0]).toEqual([]);
    }
  );

  test(
    'Select onChange calls prop onChange when clear non multi selected field',
    () => {
      const onChange = simple.mock();
      const select = getWrapper({ onChange }).find(Select);
      expect(select).toHaveLength(1);
      select.prop('onChange')(defaults.options, { action: 'clear' });
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.args[0]).toEqual({});
    }
  );

  test('Select onChange calls prop onChange as fallback', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange }).find(Select);
    expect(select).toHaveLength(1);
    select.prop('onChange')(defaults.options, { action: 'foo' });
    expect(onChange.callCount).toBe(1);
  });

  test('call props onChange with multi select if isMulti is true', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange, isMulti: true }).find(Select);

    expect(select).toHaveLength(1);
    select.prop('onChange')(defaults.options, {});
    expect(onChange.callCount).toBe(1);
    expect(onChange.lastCall.args[0]).toEqual(defaults.options);
  });

  describe('getValue', () => {
    test('fill selected option when default value is passed in', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue(
        defaults.options[0].value, defaults.options
      );
      expect(selectedOption).toEqual(defaults.options[0]);
    });

    test('return underfined if value is not exist in any options', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue('foo', defaults.options);
      expect(selectedOption).toBeUndefined();
    });

    test('return array of options if value is array', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue(['filter-1', 'filter-2'], defaults.options);
      expect(selectedOption).toEqual(defaults.options);
    });
  });
});
