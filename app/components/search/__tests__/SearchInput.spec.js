import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import SearchInput from 'components/search/SearchInput';

describe('Component: search/SearchInput', () => {
  const props = {
    initialValue: 'query',
    onSubmit: simple.stub(),
  };

  const tree = sd.shallowRender(<SearchInput {...props} />);
  const vdom = tree.getRenderOutput();

  it('should render a form', () => {
    expect(vdom.type).to.equal('form');
  });

  describe('search box', () => {
    const inputTrees = tree.everySubTree('Input');

    it('should render an Input component', () => {
      expect(inputTrees.length).to.equal(1);
    });

    it('should pass correct props to the Input', () => {
      const inputVdom = inputTrees[0].getRenderOutput();
      const actualProps = inputVdom.props;

      expect(actualProps.defaultValue).to.equal(props.initialValue);
      expect(actualProps.type).to.equal('text');
      expect(actualProps.placeholder).to.equal('Etsi tilan nimellä');
    });
  });

  describe('submit button', () => {
    const submitButton = tree.subTree('Input').getRenderOutput().props.buttonAfter;

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
});
