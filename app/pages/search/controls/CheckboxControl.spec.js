import { expect } from 'chai';
import React from 'react';
import Toggle from 'react-toggle';
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

  it('renders a Toggle with correct props', () => {
    const toggle = getWrapper({}).find(Toggle);
    expect(toggle).to.have.length(1);
    expect(toggle.prop('defaultChecked')).to.equal(defaults.value);
    expect(toggle.prop('onChange')).to.be.a('function');
  });

  it('Checkbox onChange calls prop onConfirm', () => {
    const onConfirm = simple.mock();
    const mockEvent = {
      target: {
        checked: true,
      },
    };
    const toggle = getWrapper({ onConfirm }).find(Toggle);
    expect(toggle).to.have.length(1);
    toggle.prop('onChange')(mockEvent);
    expect(onConfirm.callCount).to.equal(1);
    expect(onConfirm.lastCall.args).to.deep.equal([true]);
  });
});
