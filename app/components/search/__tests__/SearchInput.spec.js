import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import SearchInput from 'components/search/SearchInput';

describe('Component: search/SearchInput', () => {
  const props = {
    autoFocus: true,
    onChange: simple.stub(),
    onSubmit: simple.stub(),
    value: 'query',
  };

  const tree = sd.shallowRender(<SearchInput {...props} />);
  const vdom = tree.getRenderOutput();

  it('should render a form', () => {
    expect(vdom.type).to.equal('form');
  });

  it('submitting the form should call props.onSubmit', () => {
    const mockEvent = { preventDefault: simple.stub() };
    tree.props.onSubmit(mockEvent);

    expect(props.onSubmit.callCount).to.equal(1);
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

    it('changing the search box value should call props.onChange with new value', () => {
      const newValue = 'new search value';
      const mockEvent = { target: { value: newValue } };
      inputTrees[0].props.onChange(mockEvent);

      expect(props.onChange.callCount).to.equal(1);
      expect(props.onChange.lastCall.args[0]).to.equal(newValue);
    });
  });
});
