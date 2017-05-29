import { expect } from 'chai';
import React from 'react';
import Select from 'react-select';
import simple from 'simple-mock';

import MiniModal from 'shared/mini-modal';
import { shallowWithIntl } from 'utils/testUtils';
import PurposeControl from './PurposeControl';

function getWrapper(props) {
  const defaults = {
    isLoading: false,
    onChange: () => null,
    purposeOptions: [],
    value: '',
  };
  return shallowWithIntl(<PurposeControl {...defaults} {...props} />);
}

describe('pages/search/controls/PurposeControl', () => {
  it('renders a div.app-PurposeControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PurposeControl')).to.be.true;
  });

  it('renders MiniModal with correct theme', () => {
    const miniModal = getWrapper().find(MiniModal);
    expect(miniModal).to.have.length(1);
    expect(miniModal.prop('theme')).to.equal('blue');
  });

  it('renders Select with correct props', () => {
    const wrapper = getWrapper();
    const select = wrapper.find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('onChange')).to.equal(wrapper.instance().handleChange);
  });

  describe('handleChange', () => {
    it('calls props.onChange with correct value', () => {
      const onChange = simple.mock();
      const option = { label: 'Foo', value: 'bar' };
      const instance = getWrapper({ onChange }).instance();
      instance.handleChange(option);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([{ purpose: 'bar' }]);
    });
  });
});
