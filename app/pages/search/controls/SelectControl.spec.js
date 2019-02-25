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
  it('renders a div.app-SelectControl', () => {
    const wrapper = getWrapper({});
    expect(wrapper.is('div.app-SelectControl')).to.be.true;
  });

  it('renders a FormGroup with correct props', () => {
    const formGroup = getWrapper({}).find(FormGroup);
    expect(formGroup).to.have.length(1);
    expect(formGroup.prop('controlId')).to.equal(defaults.id);
  });

  it('renders a ControlLabel', () => {
    const controlLabel = getWrapper({}).find(ControlLabel);
    expect(controlLabel).to.have.length(1);
  });

  it('renders a Select with correct props', () => {
    const select = getWrapper({}).find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('isClearable')).to.be.true;
    expect(select.prop('name')).to.equal(defaults.id);
    expect(select.prop('onChange')).to.be.a('function');
    expect(select.prop('placeholder')).to.equal('common.select');
    expect(select.prop('isSearchable')).to.be.true;
    expect(select.prop('value')).to.equal(defaults.value);
  });

  it('Select onChange calls prop onChange', () => {
    const onChange = simple.mock();
    const select = getWrapper({ onChange }).find(Select);
    expect(select).to.have.length(1);
    select.prop('onChange')(defaults.options[1]);
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args).to.deep.equal([defaults.options[1].value]);
  });
});
