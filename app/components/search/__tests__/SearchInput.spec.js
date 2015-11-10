import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import SearchInput from 'components/search/SearchInput';

describe('Component: search/SearchInput', () => {
  const props = {
    autoFocus: true,
    onSubmit: simple.stub(),
    value: 'query',
  };

  const tree = sd.shallowRender(<SearchInput {...props} />);
  const vdom = tree.getRenderOutput();
  const instance = tree.getMountedInstance();

  it('should render a form', () => {
    expect(vdom.type).to.equal('form');
  });

  describe('search box', () => {
    const inputTrees = tree.everySubTree('Input');

    it('should render an Input component', () => {
      expect(inputTrees.length).to.equal(1);
    });

    it('should pass correct props to the Input', () => {
      const actualProps = inputTrees[0].props;

      expect(actualProps.autoFocus).to.equal(props.autoFocus);
      expect(actualProps.value).to.equal(props.value);
      expect(actualProps.type).to.equal('text');
      expect(actualProps.placeholder).to.equal('Etsi tilan nimellä');
    });

    it('changing the search box value should update the component state', () => {
      const newValue = 'new search value';
      const mockEvent = { target: { value: newValue } };
      inputTrees[0].props.onChange(mockEvent);

      expect(instance.state.value).to.equal(newValue);
    });
  });

  describe('submit button', () => {
    const submitButton = tree.subTree('Input').props.buttonAfter;

    it('should render a submit button', () => {
      expect(submitButton).to.exist;
    });

    it('should have a type "submit"', () => {
      expect(submitButton.props.type).to.equal('submit');
    });

    it('should have text "Hae"', () => {
      expect(submitButton.props.children).to.equal('Hae');
    });
  });

  describe('componentWillReceiveProps', () => {
    it('should update the component state with the new input value', () => {
      const newValue = 'new search value';
      instance.componentWillReceiveProps({ value: newValue });

      expect(instance.state.value).to.equal(newValue);
    });
  });
});
