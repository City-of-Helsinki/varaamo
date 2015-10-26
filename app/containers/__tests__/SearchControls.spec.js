import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import { UnconnectedSearchControls as SearchControls } from 'containers/SearchControls';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';

describe('Container: SearchControls', () => {
  let props;
  let tree;
  let instance;

  beforeEach(() => {
    props = {
      actions: {
        changeSearchFilters: simple.stub(),
        fetchPurposes: simple.stub(),
        searchResources: simple.stub(),
      },
      isFetchingPurposes: false,
      filters: {
        date: '2015-10-10',
        purpose: 'some-purpose',
        search: 'search-query',
      },
      purposeOptions: Immutable([
        { value: 'filter-1', label: 'Label 1' },
        { value: 'filter-2', label: 'Label 2' },
      ]),
    };

    tree = sd.shallowRender(<SearchControls {...props} />);
    instance = tree.getMountedInstance();
  });

  afterEach(() => {
    simple.restore();
  });

  describe('rendering SearchInput', () => {
    let searchInputTrees;

    beforeEach(() => {
      searchInputTrees = tree.everySubTree('SearchInput');
    });

    it('should render SearchInput component', () => {
      expect(searchInputTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchInput component', () => {
      const actualProps = searchInputTrees[0].props;

      expect(actualProps.initialValue).to.equal(props.filters.search);
      expect(typeof actualProps.onSubmit).to.equal('function');
    });
  });

  describe('rendering SearchFilters', () => {
    let searchFiltersTrees;

    beforeEach(() => {
      searchFiltersTrees = tree.everySubTree('SearchFilters');
    });

    it('should render SearchFilters component', () => {
      expect(searchFiltersTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchFilters component', () => {
      const actualProps = searchFiltersTrees[0].props;

      expect(actualProps.isFetchingPurposes).to.equal(props.isFetchingPurposes);
      expect(actualProps.onFiltersChange).to.equal(instance.onFiltersChange);
      expect(actualProps.purposeOptions).to.deep.equal(props.purposeOptions);
      expect(actualProps.filters).to.deep.equal(props.filters);
    });
  });

  describe('rendering DateHeader', () => {
    let dateHeaderTrees;

    beforeEach(() => {
      dateHeaderTrees = tree.everySubTree('DateHeader');
    });

    it('should render DateHeader component', () => {
      expect(dateHeaderTrees.length).to.equal(1);
    });

    it('should pass correct props to DateHeader component', () => {
      const actualProps = dateHeaderTrees[0].props;

      expect(actualProps.date).to.equal(props.filters.date);
      expect(typeof actualProps.onChange).to.equal('function');
    });

    it('DateHeader onChange should call onFiltersChange with correct arguments', () => {
      simple.mock(instance, 'onFiltersChange');
      const newDate = 'some-date';
      dateHeaderTrees[0].props.onChange(newDate);
      const expected = { date: newDate };
      const actualCallCount = instance.onFiltersChange.callCount;
      const actualArgs = instance.onFiltersChange.lastCall.args[0];
      simple.restore();

      expect(actualCallCount).to.equal(1);
      expect(actualArgs).to.deep.equal(expected);
    });
  });

  describe('rendering DatePicker', () => {
    let datePickerTrees;

    beforeEach(() => {
      datePickerTrees = tree.everySubTree('DatePicker');
    });

    it('should render DatePicker component', () => {
      expect(datePickerTrees.length).to.equal(1);
    });

    it('should pass correct props to DatePicker component', () => {
      const actualProps = datePickerTrees[0].props;

      expect(actualProps.date).to.equal(props.filters.date);
      expect(actualProps.hideFooter).to.equal(true);
      expect(typeof actualProps.onChange).to.equal('function');
    });

    it('DatePicker onChange should call onFiltersChange with correct arguments', () => {
      simple.mock(instance, 'onFiltersChange');
      const newDate = 'some-date';
      datePickerTrees[0].props.onChange(newDate);
      const expected = { date: newDate };
      const actualCallCount = instance.onFiltersChange.callCount;
      const actualArgs = instance.onFiltersChange.lastCall.args[0];
      simple.restore();

      expect(actualCallCount).to.equal(1);
      expect(actualArgs).to.deep.equal(expected);
    });
  });

  describe('onFiltersChange', () => {
    let newFilters;

    beforeEach(() => {
      newFilters = { purpose: 'new-purpose' };
      instance.onFiltersChange(newFilters);
    });

    it('should call changeSearchFilters with correct arguments', () => {
      const action = props.actions.changeSearchFilters;

      expect(action.callCount).to.equal(1);
      expect(action.lastCall.args[0]).to.deep.equal(newFilters);
    });

    it('should call searchResources with correct arguments', () => {
      const action = props.actions.searchResources;
      const allFilters = Object.assign({}, props.filters, newFilters);
      const expected = getFetchParamsFromFilters(allFilters);

      expect(action.callCount).to.equal(1);
      expect(action.lastCall.args[0]).to.deep.equal(expected);
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      instance.componentDidMount();

      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
