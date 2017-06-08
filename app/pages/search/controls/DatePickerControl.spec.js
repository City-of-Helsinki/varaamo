import { expect } from 'chai';
import React from 'react';
import { Calendar } from 'react-date-picker';

import MiniModal from 'shared/mini-modal';
import { shallowWithIntl } from 'utils/testUtils';
import DatePickerControl from './DatePickerControl';

const defaults = {
  onChange: () => null,
  value: '2017-01-01',
};
function getWrapper(props) {
  return shallowWithIntl(<DatePickerControl {...defaults} {...props} />);
}

describe('pages/search/controls/DatePickerControl', () => {
  it('renders a div.app-DatePickerControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-DatePickerControl')).to.be.true;
  });

  it('renders MiniModal with correct theme', () => {
    const miniModal = getWrapper().find(MiniModal);
    expect(miniModal).to.have.length(1);
    expect(miniModal.prop('theme')).to.equal('green');
  });

  it('renders calendar for selecting date', () => {
    const onChange = () => null;
    const calendar = getWrapper({ onChange }).find(Calendar);
    expect(calendar).to.have.length(1);
    expect(calendar.prop('onChange')).to.equal(onChange);
    expect(calendar.prop('dateFormat')).to.equal('L');
    expect(calendar.prop('value')).to.equal(defaults.value);
  });
});
