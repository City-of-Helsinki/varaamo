import { expect } from 'chai';
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
    expect(wrapper.is('div.app-SelectControl')).to.be.true;
  });

  test('renders a FormGroup with correct props', () => {
    const formGroup = getWrapper({}).find(FormGroup);
    expect(formGroup).to.have.length(1);
    expect(formGroup.prop('controlId')).to.equal(defaults.id);
  });

  test('renders a ControlLabel', () => {
    const controlLabel = getWrapper({}).find(ControlLabel);
    expect(controlLabel).to.have.length(1);
  });

  test('hide Select when isLoading=true', () => {
    const select = getWrapper({ isLoading: true }).find(Select);

    expect(select).to.have.length(0);
  });

  test('disable Select when isDisable was true', () => {
    const select = getWrapper({ isDisable: true }).find(Select);

    expect(select.prop('isDisable')).to.be.true;
  });

  test('renders a Select with correct props', () => {
    const select = getWrapper({}).find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('isClearable')).to.be.true;
    expect(select.prop('id')).to.equal(defaults.id);
    expect(select.prop('name')).to.equal(defaults.name);
    expect(select.prop('onChange')).to.be.a('function');
    expect(select.prop('placeholder')).to.equal('common.select');
    expect(select.prop('isSearchable')).to.be.true;
    expect(select.prop('value')).to.equal(defaults.options[0]);
  });

  test(
    'renders a Select with props className contain app-Select, so the styling will work',
    () => {
      const select = getWrapper({ className: 'foo' }).find(Select);
      const defaultSelect = getWrapper().find(Select);

      expect(select).to.have.length(1);
      expect(select.prop('className')).to.include('app-Select');
      expect(select.prop('className')).to.include('foo');
      expect(defaultSelect.prop('className')).to.include('app-Select');
    }
  );

  test('Select onChange calls prop onChange', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange }).find(Select);
    expect(select).to.have.length(1);
    select.prop('onChange')(defaults.options[1], {});
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).to.deep.equal(defaults.options[1]);
  });

  test(
    'Select onChange calls prop onChange when clear multi selected field',
    () => {
      const onChange = simple.mock();
      const multiSelect = getWrapper({ onChange, isMulti: true }).find(Select);
      expect(multiSelect).to.have.length(1);
      multiSelect.prop('onChange')(defaults.options, { action: 'clear' });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.deep.equal([]);
    }
  );

  test(
    'Select onChange calls prop onChange when clear non multi selected field',
    () => {
      const onChange = simple.mock();
      const select = getWrapper({ onChange }).find(Select);
      expect(select).to.have.length(1);
      select.prop('onChange')(defaults.options, { action: 'clear' });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.deep.equal({});
    }
  );

  test('Select onChange calls prop onChange as fallback', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange }).find(Select);
    expect(select).to.have.length(1);
    select.prop('onChange')(defaults.options, { action: 'foo' });
    expect(onChange.callCount).to.equal(1);
  });

  test('call props onChange with multi select if isMulti is true', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange, isMulti: true }).find(Select);

    expect(select).to.have.length(1);
    select.prop('onChange')(defaults.options, {});
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).to.deep.equal(defaults.options);
  });

  describe('getValue', () => {
    test('fill selected option when default value is passed in', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue(
        defaults.options[0].value, defaults.options);
      expect(selectedOption).to.deep.equal(defaults.options[0]);
    });

    test('return underfined if value is not exist in any options', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue('foo', defaults.options);
      expect(selectedOption).to.be.undefined;
    });

    test('return array of options if value is array', () => {
      const wrapper = getWrapper({});
      const selectedOption = wrapper.instance().getValue(['filter-1', 'filter-2'], defaults.options);
      expect(selectedOption).to.deep.equal(defaults.options);
    });
  });
});
