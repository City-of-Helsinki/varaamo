import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import queryString from 'query-string';
import Immutable from 'seamless-immutable';

import { UnconnectedSearchControls as SearchControls } from './SearchControls';

describe('pages/search/controls/SearchControls', () => {
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
      urlSearchFilters: {},
    };

    tree = sd.shallowRender(<SearchControls {...props} />);
    instance = tree.getMountedInstance();
  });

  afterEach(() => {
    simple.restore();
  });

  describe('FormControl for search query', () => {
    let formControlTrees;

    beforeEach(() => {
      formControlTrees = tree.everySubTree('FormControl');
    });

    it('renders', () => {
      expect(formControlTrees.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = formControlTrees[0].props;

      expect(actualProps.autoFocus).to.equal(false);
      expect(typeof actualProps.onChange).to.equal('function');
      expect(actualProps.onKeyUp).to.equal(instance.handleSearchInputChange);
      expect(actualProps.type).to.equal('text');
      expect(actualProps.value).to.equal(props.filters.search);
    });
  });

  describe('rendering AdvancedSearch', () => {
    let advancedSearchTrees;

    beforeEach(() => {
      advancedSearchTrees = tree.everySubTree('AdvancedSearch');
    });

    it('should render AdvancedSearch component', () => {
      expect(advancedSearchTrees.length).to.equal(1);
    });

    it('should pass correct props to AdvancedSearch component', () => {
      const actualProps = advancedSearchTrees[0].props;

      expect(actualProps.isFetchingPurposes).to.equal(props.isFetchingPurposes);
      expect(actualProps.onFiltersChange).to.equal(instance.onFiltersChange);
      expect(actualProps.purposeOptions).to.deep.equal(props.purposeOptions);
      expect(actualProps.filters).to.deep.equal(props.filters);
    });
  });

  describe('rendering DateField', () => {
    let dateFieldTrees;

    beforeEach(() => {
      dateFieldTrees = tree.everySubTree('DateField');
    });

    it('should render DateField component', () => {
      expect(dateFieldTrees.length).to.equal(1);
    });

    it('should pass correct props to DateField component', () => {
      const actualProps = dateFieldTrees[0].props;

      expect(actualProps.defaultValue).to.equal(props.filters.date);
      expect(typeof actualProps.onChange).to.equal('function');
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
