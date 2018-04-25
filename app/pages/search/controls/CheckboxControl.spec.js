import { expect } from 'chai';
import React from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
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
  it('renders a div.app-CheckboxControl', () => {
    const wrapper = getWrapper({});
    expect(wrapper.is('div.app-CheckboxControl')).to.be.true;
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

  it('renders a Checkbox with correct props', () => {
    const checkbox = getWrapper({}).find(Checkbox);
    expect(checkbox).to.have.length(1);
    expect(checkbox.prop('checked')).to.equal(defaults.value);
    expect(checkbox.prop('onClick')).to.be.a('function');
  });

  it('Checkbox onClick calls prop onConfirm', () => {
    const onConfirm = simple.mock();
    const mockEvent = {
      target: {
        checked: true,
      },
    };
    const checkbox = getWrapper({ onConfirm }).find(Checkbox);
    expect(checkbox).to.have.length(1);
    checkbox.prop('onClick')(mockEvent);
    expect(onConfirm.callCount).to.equal(1);
    expect(onConfirm.lastCall.args).to.deep.equal([true]);
  });
});
