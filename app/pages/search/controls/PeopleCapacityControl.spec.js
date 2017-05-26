import { expect } from 'chai';
import React from 'react';
import NumericInput from 'react-numeric-input';

import MiniModal from 'shared/mini-modal';
import { shallowWithIntl } from 'utils/testUtils';
import PeopleCapacityControl from './PeopleCapacityControl';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    value: 5,
  };
  return shallowWithIntl(<PeopleCapacityControl {...defaults} {...props} />);
}

describe('pages/search/controls/PeopleCapacityControl', () => {
  it('renders a div.app-PeopleCapacityControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PeopleCapacityControl')).to.be.true;
  });

  it('renders MiniModal with correct theme', () => {
    const miniModal = getWrapper().find(MiniModal);
    expect(miniModal).to.have.length(1);
    expect(miniModal.prop('theme')).to.equal('orange');
  });

  it('renders numeric input for selecting number of people', () => {
    const onChange = () => null;
    const numericInput = getWrapper({ onChange }).find(NumericInput);
    expect(numericInput).to.have.length(1);
    expect(numericInput.prop('onChange')).to.equal(onChange);
  });
});
