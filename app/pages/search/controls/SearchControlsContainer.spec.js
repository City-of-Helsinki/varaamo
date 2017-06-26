import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import DatePickerControl from './DatePickerControl';
import PeopleCapacityControl from './PeopleCapacityControl';
import PurposeControl from './PurposeControl';
import SearchBox from './SearchBox';
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
    return shallow(<SearchControlsContainer {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders SearchBox with correct props', () => {
      const filters = { ...defaultProps.filters, search: 'my search' };
      const wrapper = getWrapper({ filters });
      const searchBox = wrapper.find(SearchBox);
      expect(searchBox).to.have.length(1);
      expect(searchBox.prop('onChange')).to.be.a('function');
      expect(searchBox.prop('onSearch')).to.equal(wrapper.instance().handleSearch);
      expect(searchBox.prop('value')).to.equal(filters.search);
    });

    it('renders DatePickerControl with correct props', () => {
      const filters = { ...defaultProps.filters, date: '2015-10-10' };
      const wrapper = getWrapper({ filters });
      const datePickerControl = wrapper.find(DatePickerControl);
      expect(datePickerControl).to.have.length(1);
      expect(datePickerControl.prop('value')).to.equal(moment(filters.date).format('L'));
      expect(datePickerControl.prop('onConfirm')).to.equal(wrapper.instance().handleDateChange);
    });

    it('renders PeopleCapacityControl with correct props', () => {
      const filters = { ...defaultProps.filters, people: '12' };
      const peopleCapacityControl = getWrapper({ filters }).find(PeopleCapacityControl);
      expect(peopleCapacityControl).to.have.length(1);
      expect(peopleCapacityControl.prop('value')).to.equal(12);
      expect(peopleCapacityControl.prop('onConfirm')).to.exist;
    });

    it('renders PurposeControl with correct props', () => {
      const filters = { ...defaultProps.filters, purpose: 'some purpose' };
      const isFetchingPurposes = false;
      const purposeOptions = [{ label: 'Foo', value: 'bar' }];
      const wrapper = getWrapper({ filters, isFetchingPurposes, purposeOptions });
      const purposeControl = wrapper.find(PurposeControl);
      expect(purposeControl).to.have.length(1);
      expect(purposeControl.prop('isLoading')).to.equal(isFetchingPurposes);
      expect(purposeControl.prop('onConfirm')).to.exist;
      expect(purposeControl.prop('purposeOptions')).to.equal(purposeOptions);
      expect(purposeControl.prop('value')).to.equal(filters.purpose);
    });
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
      const expectedPath = `/?${queryString.stringify(defaultProps.filters)}`;

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
