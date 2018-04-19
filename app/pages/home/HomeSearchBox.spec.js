import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import HomeSearchBox from './HomeSearchBox';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    onSearch: () => null,
    value: 'meeting room',
  };
  return shallowWithIntl(<HomeSearchBox {...defaults} {...props} />);
}

describe('pages/home/HomeSearchBox', () => {
  it('renders a form.app-HomeSearchBox', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('form.app-HomeSearchBox')).to.be.true;
  });

  it('renders FormControl with correct props', () => {
    const value = 'some search query';
    const wrapper = getWrapper({ value });
    const formControl = wrapper.find(FormControl);
    expect(formControl).to.have.length(1);
    expect(formControl.prop('onChange')).to.equal(wrapper.instance().handleChange);
    expect(formControl.prop('type')).to.equal('text');
    expect(formControl.prop('placeholder')).to.equal('HomeSearchBox.searchPlaceholder');
  });

  it('renders search button', () => {
    const button = getWrapper().find(Button);
    expect(button).to.have.length(1);
    expect(button.prop('children')).to.equal('HomeSearchBox.buttonText');
  });

  describe('handleSubmit', () => {
    it('calls props.onSearch', () => {
      const mockEvent = { preventDefault: () => null };
      const onSearch = simple.mock();
      const instance = getWrapper({ onSearch }).instance();
      instance.handleSubmit(mockEvent);
      expect(onSearch.callCount).to.equal(1);
    });

    it('calls event.preventDefault', () => {
      const mockEvent = { preventDefault: simple.mock() };
      const instance = getWrapper().instance();
      instance.handleSubmit(mockEvent);
      expect(mockEvent.preventDefault.callCount).to.equal(1);
    });
  });

  describe('handleChange', () => {
    it('calls this.props.onChange with correct value', () => {
      const instance = getWrapper().instance();
      const mockEvent = { preventDefault: simple.mock(), target: { value: 'some value' } };
      instance.handleChange(mockEvent);
      expect(instance.state.value).to.equal(mockEvent.target.value);
    });
  });
});
