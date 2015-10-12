import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import SearchFilters from 'components/search/SearchFilters';

describe('Component: search/SearchFilters', () => {
  const props = {
    isFetchingPurposes: false,
    onFiltersChange: simple.stub(),
    filters: { purpose: 'some-filter' },
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
  };

  const tree = sd.shallowRender(<SearchFilters {...props} />);

  describe('purpose filter', () => {
    const selectTrees = tree.everySubTree('Select');

    it('should render a Select component', () => {
      expect(selectTrees.length).to.equal(1);
    });

    describe('Select props', () => {
      const selectVdom = selectTrees[0].getRenderOutput();

      it('should pass clearable = true', () => {
        expect(selectVdom.props.clearable).to.equal(true);
      });

      it('should pass isFetchingPurposes as isLoading', () => {
        expect(selectVdom.props.isLoading).to.equal(props.isFetchingPurposes);
      });

      it('should pass a function to onChange', () => {
        expect(typeof selectVdom.props.onChange).to.equal('function');
      });

      it('should pass purposeOptions as options', () => {
        expect(selectVdom.props.options).to.deep.equal(props.purposeOptions);
      });

      it('should pass a placeholder text', () => {
        expect(selectVdom.props.placeholder).to.be.ok;
      });

      it('should pass filters.purpose as value', () => {
        expect(selectVdom.props.value).to.equal(props.filters.purpose);
      });
    });

    describe('onChange', () => {
      const selectVdom = selectTrees[0].getRenderOutput();
      const filterValue = 'new-value';

      before(() => {
        selectVdom.props.onChange(filterValue);
      });

      it('should call onFiltersChange ', () => {
        expect(props.onFiltersChange.callCount).to.equal(1);
      });

      it('should call onFiltersChange with correct arguments', () => {
        const expected = { purpose: filterValue };

        expect(props.onFiltersChange.lastCall.args[0]).to.deep.equal(expected);
      });
    });
  });
});
