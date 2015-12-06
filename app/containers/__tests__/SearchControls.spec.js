import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import queryString from 'query-string';
import Immutable from 'seamless-immutable';

import { UnconnectedSearchControls as SearchControls } from 'containers/SearchControls';

describe('Container: SearchControls', () => {
  let props;
  let tree;
  let instance;

  beforeEach(() => {
    props = {
      actions: {
        changeSearchFilters: simple.stub(),
        fetchPurposes: simple.stub(),
        updatePath: simple.stub(),
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
      scrollToSearchResults: simple.stub(),
      typeaheadOptions: ['mock-suggestion'],
      urlSearchFilters: {},
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

      expect(actualProps.autoFocus).to.equal(false);
      expect(typeof actualProps.onSubmit).to.equal('function');
      expect(actualProps.typeaheadOptions).to.equal(props.typeaheadOptions);
      expect(actualProps.value).to.equal(props.filters.search);
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
      expect(actualProps.onChange).to.equal(instance.onDateChange);
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
      expect(actualProps.onChange).to.equal(instance.onDateChange);
    });
  });

  describe('onDateChange', () => {
    const newDate = '2016-12-12';

    it('should call onFiltersChange with correct filter', () => {
      simple.mock(instance, 'onFiltersChange').returnWith(null);
      simple.mock(instance, 'handleSearch').returnWith(null);
      instance.onDateChange(newDate);

      expect(instance.onFiltersChange.callCount).to.equal(1);
      expect(instance.onFiltersChange.lastCall.args[0]).to.deep.equal({ date: newDate });

      simple.restore();
    });

    it('should call handleSearch with correct arguments', () => {
      simple.mock(instance, 'onFiltersChange').returnWith(null);
      simple.mock(instance, 'handleSearch').returnWith(null);
      instance.onDateChange(newDate);

      expect(instance.handleSearch.callCount).to.equal(1);
      expect(instance.handleSearch.lastCall.args[0]).to.deep.equal({ date: newDate });
      expect(instance.handleSearch.lastCall.args[1]).to.deep.equal({ preventScrolling: true });

      simple.restore();
    });
  });

  describe('onFiltersChange', () => {
    it('should call changeSearchFilters with given filters', () => {
      const newFilters = { search: 'new search value' };
      instance.onFiltersChange(newFilters);

      expect(props.actions.changeSearchFilters.callCount).to.equal(1);
      expect(props.actions.changeSearchFilters.lastCall.args[0]).to.equal(newFilters);
    });
  });

  describe('handleSearch', () => {
    let newFilters;

    beforeEach(() => {
      instance.handleSearch(newFilters);
    });

    it('should call updatePath with correct url', () => {
      const actualUrl = props.actions.updatePath.lastCall.args[0];
      const expectedUrl = `/search?${queryString.stringify(props.filters)}`;

      expect(props.actions.updatePath.callCount).to.equal(1);
      expect(actualUrl).to.equal(expectedUrl);
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      instance.componentDidMount();

      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
