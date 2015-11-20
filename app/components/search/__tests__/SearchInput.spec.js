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
    pushState: simple.stub(),
    typeaheadOptions: ['mock-suggestion'],
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

  describe('Typeahead', () => {
    const typeaheadTrees = tree.everySubTree('Typeahead');

    it('should render a Typeahead component', () => {
      expect(typeaheadTrees.length).to.equal(1);
    });

    it('should pass correct props to the Typeahead', () => {
      const actualProps = typeaheadTrees[0].props;

      expect(actualProps.inputProps).to.deep.equal({ autoFocus: props.autoFocus });
      expect(actualProps.options).to.equal(props.typeaheadOptions);
      expect(actualProps.value).to.equal(props.value);
    });

    it('changing the search box value should call props.onChange with new value', () => {
      const newValue = 'new search value';
      const mockEvent = { target: { value: newValue } };
      typeaheadTrees[0].props.onKeyUp(mockEvent);

      expect(props.onChange.callCount).to.equal(1);
      expect(props.onChange.lastCall.args[0]).to.equal(newValue);
    });
  });
});
