import { expect } from 'chai';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Select from 'react-select';
import simple from 'simple-mock';

import DatePicker from 'shared/date-picker';
import { shallowWithIntl } from 'utils/testUtils';
import RecurringReservationControls from './RecurringReservationControls';

function getWrapper(props) {
  const defaults = {
    changeFrequency: () => null,
    changeNumberOfOccurrences: () => null,
    changeLastTime: () => null,
    frequency: 'days',
    frequencyOptions: [{ label: '', value: '' }],
    isVisible: true,
    lastTime: null,
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
      lastTime: '2017-04-09',
    };
    const select = getWrapper(props).find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('onChange')).to.equal(props.changeFrequency);
    expect(select.prop('options')).to.equal(props.frequencyOptions);
    expect(select.prop('value')).to.equal(props.frequency);
  });

  it('renders FormControl to change number of occurrences', () => {
    const props = {
      lastTime: '2017-04-09',
      numberOfOccurrences: 12,
    };
    const control = getWrapper(props).find(FormControl);
    expect(control).to.have.length(1);
    expect(control.prop('min')).to.equal(1);
    expect(control.prop('value')).to.equal(props.numberOfOccurrences);
  });

  it('renders DatePicker with correct props', () => {
    const props = {
      lastTime: '2017-04-09',
      numberOfOccurrences: 12,
      changeLastTime: simple.mock(),
    };
    const control = getWrapper(props).find(DatePicker);
    expect(control).to.have.length(1);
    expect(control.prop('dateFormat')).to.equal('D.M.YYYY');
    expect(control.prop('formControl')).to.be.true;
    expect(control.prop('onChange')).to.equal(props.changeLastTime);
    expect(control.prop('value')).to.equal(props.lastTime);
  });

  describe('without set frecuency', () => {
    let wrapper;
    before(() => {
      wrapper = getWrapper({ frequency: '' });
    });

    it('does not render numbrerOfOcurrences FormControl', () => {
      expect(wrapper.find(FormControl)).to.have.length(0);
    });

    it('does not render DatePicker', () => {
      expect(wrapper.find(DatePicker)).to.have.length(0);
    });
  });
});
