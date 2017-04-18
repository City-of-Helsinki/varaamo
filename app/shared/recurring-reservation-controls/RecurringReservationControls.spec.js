import { expect } from 'chai';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';

import { shallowWithIntl } from 'utils/testUtils';
import RecurringReservationControls from './RecurringReservationControls';

function getWrapper(props) {
  const defaults = {
    changeFrequency: () => null,
    changeNumberOfOccurrences: () => null,
    frequency: 'days',
    frequencyOptions: [{ label: '', value: '' }],
    isVisible: true,
    numberOfOccurrences: 1,
  };
  return shallowWithIntl(<RecurringReservationControls {...defaults} {...props} />);
}

describe('shared/RecurringReservationControls/RecurringReservationControls', () => {
  it('renders an empty span if isVisible is false', () => {
    const wrapper = getWrapper({ isVisible: false });
    expect(wrapper.equals(<span />)).to.be.true;
  });

  it('renders Select with correct props', () => {
    const props = {
      changeFrequency: () => null,
      frequency: 'days',
      frequencyOptions: [{ label: '', value: '' }],
    };
    const select = getWrapper(props).find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('onChange')).to.equal(props.changeFrequency);
    expect(select.prop('options')).to.equal(props.frequencyOptions);
    expect(select.prop('value')).to.equal(props.frequency);
  });

  it('renders FormControl to change number of occurrences', () => {
    const props = {
      numberOfOccurrences: 12,
    };
    const control = getWrapper(props).find(FormControl);
    expect(control).to.have.length(1);
    expect(control.prop('min')).to.equal(1);
    expect(control.prop('value')).to.equal(props.numberOfOccurrences);
  });
});
