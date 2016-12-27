import { expect } from 'chai';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import { DateField } from 'react-date-picker';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import AdvancedSearch from './AdvancedSearch';
import {
  UnconnectedSearchControlsContainer as SearchControlsContainer,
} from './SearchControlsContainer';

describe('pages/search/controls/SearchControlsContainer', () => {
  const defaultProps = {
    actions: {
      changeSearchFilters: () => null,
      fetchPurposes: () => null,
      searchResources: () => null,
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
    scrollToSearchResults: () => null,
    urlSearchFilters: {},
  };

  function getWrapper(props) {
    return shallowWithIntl(<SearchControlsContainer {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders FormControl for search query', () => {
      const wrapper = getWrapper();
      const formControl = wrapper.find(FormControl);
      expect(formControl).to.have.length(1);
      expect(formControl.prop('autoFocus')).to.equal(false);
      expect(typeof formControl.prop('onChange')).to.equal('function');
      expect(formControl.prop('onKeyUp')).to.equal(wrapper.instance().handleSearchInputChange);
      expect(formControl.prop('type')).to.equal('text');
      expect(formControl.prop('value')).to.equal(defaultProps.filters.search);
    });

    describe('DateField', () => {
      function getDateFieldWrapper(props) {
        return getWrapper(props).find(DateField);
      }

      it('is rendered', () => {
        expect(getDateFieldWrapper()).to.have.length(1);
      });

      it('gets correct onChange prop', () => {
        const wrapper = getWrapper();
        const actual = wrapper.find(DateField).prop('onChange');

        expect(actual).to.equal(wrapper.instance().handleDateChange);
      });

      it('converts value to localized date format and passes it to DateField', () => {
        const actual = getDateFieldWrapper().prop('value');
        const expected = moment(defaultProps.filters.date).format('L');
        expect(actual).to.equal(expected);
      });
    });
  });

  it('renders AdvancedSearch with correct props', () => {
    const wrapper = getWrapper();
    const advancedSearch = wrapper.find(AdvancedSearch);
    expect(advancedSearch).to.have.length(1);
    expect(advancedSearch.prop('isFetchingPurposes')).to.equal(defaultProps.isFetchingPurposes);
    expect(advancedSearch.prop('onFiltersChange')).to.equal(wrapper.instance().handleFiltersChange);
    expect(advancedSearch.prop('purposeOptions')).to.deep.equal(defaultProps.purposeOptions);
    expect(advancedSearch.prop('filters')).to.deep.equal(defaultProps.filters);
  });

  describe('handleFiltersChange', () => {
    it('calls changeSearchFilters with given filters', () => {
      const newFilters = { search: 'new search value' };
      const changeSearchFilters = simple.mock();
      const instance = getWrapper({ actions: { changeSearchFilters } }).instance();
      instance.handleFiltersChange(newFilters);
      expect(changeSearchFilters.callCount).to.equal(1);
      expect(changeSearchFilters.lastCall.args[0]).to.equal(newFilters);
    });
  });

  describe('handleSearch', () => {
    const newFilters = {};
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
      getWrapper().instance().handleSearch(newFilters);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.push with correct path', () => {
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = `/search?${queryString.stringify(defaultProps.filters)}`;

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('componentDidMount', () => {
    it('fetches resources when component mounts', () => {
      const actions = {
        fetchPurposes: simple.mock(),
        changeSearchFilters: () => null,
      };
      getWrapper({ actions }).instance().componentDidMount();

      expect(actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
