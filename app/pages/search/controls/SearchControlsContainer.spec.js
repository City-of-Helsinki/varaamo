import { expect } from 'chai';
import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import { browserHistory } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
import { shallowWithIntl } from 'utils/testUtils';
import CheckboxControl from './CheckboxControl';
import DatePickerControl from './DatePickerControl';
import PositionControl from './PositionControl';
import SearchBox from './SearchBox';
import SelectControl from './SelectControl';
import TimeRangeControl from './TimeRangeControl';
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
    currentLanguage: 'fi',
    isFetchingPurposes: false,
    isFetchingUnits: false,
    filters: {
      charge: false,
      date: '2015-10-10',
      duration: 0,
      end: '',
      page: 1,
      people: '12',
      purpose: 'some-purpose',
      search: 'search-query',
      start: '',
      unit: 'some-unit',
    },
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
    scrollToSearchResults: () => null,
    unitOptions: Immutable([
      { value: 'unit-1', label: 'Unit 1' },
      { value: 'unit-2', label: 'Unit 2' },
    ]),
    urlSearchFilters: {},
  };

  function getWrapper(props) {
    return shallowWithIntl(<SearchControlsContainer {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders SearchBox with correct props', () => {
      const filters = { ...defaultProps.filters, search: 'my search' };
      const wrapper = getWrapper({ filters });
      const searchBox = wrapper.find(SearchBox);
      const expectedOptions = defaultProps.purposeOptions.concat(defaultProps.unitOptions);
      expect(searchBox).to.have.length(1);
      expect(searchBox.prop('onChange')).to.be.a('function');
      expect(searchBox.prop('onSearch')).to.equal(wrapper.instance().handleSearch);
      expect(searchBox.prop('options')).to.deep.equal(expectedOptions);
      expect(searchBox.prop('value')).to.equal(filters.search);
    });

    it('renders DatePickerControl with correct props', () => {
      const filters = { ...defaultProps.filters, date: '2015-10-10' };
      const wrapper = getWrapper({ filters });
      const datePickerControl = wrapper.find(DatePickerControl);
      expect(datePickerControl).to.have.length(1);
      expect(datePickerControl.prop('currentLanguage')).to.equal(defaultProps.currentLanguage);
      expect(datePickerControl.prop('date')).to.equal(moment(filters.date).format('L'));
      expect(datePickerControl.prop('onConfirm')).to.equal(wrapper.instance().handleDateChange);
    });

    it('renders SelectControl for purpose with correct props', () => {
      const selectControl = getWrapper({}).find(SelectControl);
      expect(selectControl).to.have.length(3);
      expect(selectControl.at(0).prop('id')).to.equal('purpose');
      expect(selectControl.at(0).prop('isLoading')).to.equal(defaultProps.isFetchingPurposes);
      expect(selectControl.at(0).prop('label')).to.equal('SearchControlsContainer.purposeLabel');
      expect(selectControl.at(0).prop('onConfirm')).to.exist;
      expect(selectControl.at(0).prop('options')).to.deep.equal(defaultProps.purposeOptions);
      expect(selectControl.at(0).prop('value')).to.equal(defaultProps.filters.purpose);
    });

    it('renders SelectControl for unit with correct props', () => {
      const selectControl = getWrapper({}).find(SelectControl);
      expect(selectControl).to.have.length(3);
      expect(selectControl.at(1).prop('id')).to.equal('unit');
      expect(selectControl.at(1).prop('isLoading')).to.equal(defaultProps.isFetchingUnits);
      expect(selectControl.at(1).prop('label')).to.equal('SearchControlsContainer.unitLabel');
      expect(selectControl.at(1).prop('onConfirm')).to.exist;
      expect(selectControl.at(1).prop('options')).to.deep.equal(defaultProps.unitOptions);
      expect(selectControl.at(1).prop('value')).to.equal(defaultProps.filters.unit);
    });

    it('renders SelectControl for people with correct props', () => {
      const peopleOptions = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '15', label: '15' },
        { value: '20', label: '20' },
        { value: '25', label: '25' },
        { value: '30', label: '30+' },
      ];
      const selectControl = getWrapper({}).find(SelectControl);
      expect(selectControl).to.have.length(3);
      expect(selectControl.at(2).prop('id')).to.equal('people');
      expect(selectControl.at(2).prop('isLoading')).to.equal(defaultProps.isFetchingPurposes);
      expect(selectControl.at(2).prop('label')).to.equal('SearchControlsContainer.peopleCapacityLabel');
      expect(selectControl.at(2).prop('onConfirm')).to.exist;
      expect(selectControl.at(2).prop('options')).to.deep.equal(peopleOptions);
      expect(selectControl.at(2).prop('value')).to.equal(defaultProps.filters.people);
    });

    it('renders PositionControl with correct props', () => {
      const filters = { ...defaultProps.filters, distance: '5000' };
      const positionControl = getWrapper({
        filters,
        position: { lat: 1, lon: 2 },
      }).find(PositionControl);
      expect(positionControl).to.have.length(1);
      expect(positionControl.prop('geolocated')).to.be.true;
      expect(positionControl.prop('onConfirm')).to.exist;
      expect(positionControl.prop('onPositionSwitch')).to.exist;
      expect(positionControl.prop('value')).to.equal(5000);
    });

    it('renders TimeRangeControl with correct props', () => {
      const filters = { ...defaultProps.filters, duration: 30, end: '23:30', start: '09:00' };
      const wrapper = getWrapper({ filters });
      const timeRangeControl = wrapper.find(TimeRangeControl);
      expect(timeRangeControl).to.have.length(1);
      expect(timeRangeControl.prop('duration')).to.equal(filters.duration);
      expect(timeRangeControl.prop('end')).to.equal(filters.end);
      expect(timeRangeControl.prop('onChange')).to.equal(wrapper.instance().handleTimeRangeChange);
      expect(timeRangeControl.prop('onTimeRangeSwitch')).to.equal(wrapper.instance().handleTimeRangeSwitch);
      expect(timeRangeControl.prop('start')).to.equal(filters.start);
    });

    it('renders CheckboxControl with correct props', () => {
      const checkboxControl = getWrapper({}).find(CheckboxControl);
      expect(checkboxControl).to.have.length(1);
      expect(checkboxControl.prop('id')).to.equal('charge');
      expect(checkboxControl.prop('label')).to.equal('SearchControlsContainer.chargeLabel');
      expect(checkboxControl.prop('onConfirm')).to.be.a('function');
      expect(checkboxControl.prop('value')).to.equal(defaultProps.filters.charge);
    });

    it('renders search Button with correct props', () => {
      const buttons = getWrapper({}).find(Button);
      expect(buttons).to.have.length(2);
      expect(buttons.at(0).prop('bsStyle')).to.be.equal('primary');
      expect(buttons.at(0).prop('onClick')).to.be.a('function');
      expect(buttons.at(0).prop('type')).to.be.equal('submit');
    });

    it('renders reset Button with correct props', () => {
      const wrapper = getWrapper({});
      const instance = wrapper.instance();
      const buttons = wrapper.find(Button);
      expect(buttons).to.have.length(2);
      expect(buttons.at(1).prop('bsStyle')).to.be.equal('link');
      expect(buttons.at(1).prop('onClick')).to.equal(instance.handleReset);
    });
  });

  describe('SelectControl onConfirm', () => {
    let instance;
    let selectControl;

    before(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleFiltersChange = simple.mock();
      selectControl = wrapper.find(SelectControl);
    });

    after(() => {
      simple.restore();
    });

    afterEach(() => {
      instance.handleFiltersChange.reset();
    });

    it('calls handleFiltersChange on purpose SelectControl onConfirm', () => {
      const purpose = 'some-purpose';
      expect(selectControl).to.have.length(3);
      expect(selectControl.at(0).prop('onConfirm')).to.be.a('function');
      selectControl.at(0).prop('onConfirm')(purpose);
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal({ purpose });
    });

    it('calls handleFiltersChange on unit SelectControl onConfirm', () => {
      const unit = 'some-unit';
      expect(selectControl).to.have.length(3);
      expect(selectControl.at(1).prop('onConfirm')).to.be.a('function');
      selectControl.at(1).prop('onConfirm')(unit);
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal({ unit });
    });

    it('calls handleFiltersChange on people SelectControl onConfirm', () => {
      const people = '5';
      expect(selectControl).to.have.length(3);
      expect(selectControl.at(2).prop('onConfirm')).to.be.a('function');
      selectControl.at(2).prop('onConfirm')(people);
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal({ people });
    });
  });

  describe('PositionControl onConfirm', () => {
    let positionControl;
    let instance;

    before(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleFiltersChange = simple.mock();
      positionControl = wrapper.find(PositionControl);
    });

    after(() => {
      simple.restore();
    });

    it('calls handleFiltersChange on PositionControl onConfirm', () => {
      const distance = 1000;
      expect(positionControl).to.have.length(1);
      expect(positionControl.at(0).prop('onConfirm')).to.be.a('function');
      positionControl.at(0).prop('onConfirm')(distance);
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal({ distance });
    });
  });

  describe('CheckboxControl onConfirm', () => {
    let checkboxControl;
    let instance;

    before(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleFiltersChange = simple.mock();
      checkboxControl = wrapper.find(CheckboxControl);
    });

    after(() => {
      simple.restore();
    });

    it('calls handleFiltersChange on charge CheckboxControl control onConfirm', () => {
      const charge = true;
      expect(checkboxControl).to.have.length(1);
      expect(checkboxControl.at(0).prop('onConfirm')).to.be.a('function');
      checkboxControl.at(0).prop('onConfirm')(charge);
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal({ charge });
    });
  });

  describe('handleDateChange', () => {
    const { date, duration, end, start } = defaultProps.filters;
    const expected = { date, duration, end, start };
    let instance;

    before(() => {
      instance = getWrapper().instance();
      instance.handleFiltersChange = simple.mock();
      instance.handleDateChange(defaultProps.filters);
    });

    after(() => {
      simple.restore();
    });

    it('calls handleFiltersChange with given filters', () => {
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal(expected);
    });
  });

  describe('handleFiltersChange', () => {
    it('calls props actions changeSearchFilters with given filters', () => {
      const newFilters = { search: 'new search value' };
      const changeSearchFilters = simple.mock();
      const instance = getWrapper({ actions: { changeSearchFilters } }).instance();
      instance.handleFiltersChange(newFilters);
      expect(changeSearchFilters.callCount).to.equal(1);
      expect(changeSearchFilters.lastCall.args[0]).to.equal(newFilters);
    });
  });

  describe('handlePositionSwitch', () => {
    it('calls props actions enableGeoposition when no position', () => {
      const enableGeoposition = simple.mock();
      const disableGeoposition = simple.mock();
      const props = {
        actions: { enableGeoposition, disableGeoposition },
      };
      const instance = getWrapper(props).instance();
      instance.handlePositionSwitch();
      expect(enableGeoposition.callCount).to.equal(1);
      expect(disableGeoposition.callCount).to.equal(0);
    });
    it('calls props actions disableGeoposition when position', () => {
      const enableGeoposition = simple.mock();
      const disableGeoposition = simple.mock();
      const props = {
        actions: { enableGeoposition, disableGeoposition },
        position: { lat: 1, lon: 2 },
      };
      const instance = getWrapper(props).instance();
      instance.handlePositionSwitch();
      expect(disableGeoposition.callCount).to.equal(1);
      expect(enableGeoposition.callCount).to.equal(0);
    });
  });

  describe('handleSearchBoxChange', () => {
    it('calls props actions changeSearchFilters with given filters', () => {
      const search = 'new search value';
      const changeSearchFilters = simple.mock();
      const instance = getWrapper({ actions: { changeSearchFilters } }).instance();
      instance.handleSearchBoxChange(search);
      expect(changeSearchFilters.callCount).to.equal(1);
      expect(changeSearchFilters.lastCall.args[0]).to.deep.equal({ search });
    });
  });

  describe('Search button onClick', () => {
    let buttons;
    let instance;

    before(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleSearch = simple.mock();
      buttons = wrapper.find(Button);
    });

    after(() => {
      simple.restore();
    });

    it('calls handleSearch on search button onClick', () => {
      expect(buttons).to.have.length(2);
      expect(buttons.at(0).prop('onClick')).to.be.a('function');
      buttons.at(0).prop('onClick')();
      expect(instance.handleSearch.callCount).to.equal(1);
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

  describe('handleReset', () => {
    const disableGeoposition = simple.mock();
    let instance;

    before(() => {
      const props = {
        actions: { disableGeoposition },
        position: { lat: 1, lon: 2 },
      };
      instance = getWrapper(props).instance();
      instance.handleFiltersChange = simple.mock();
      instance.handleReset();
    });

    after(() => {
      simple.restore();
    });

    it('calls handleFiltersChange with empty filters', () => {
      const emptyFilters = Object.assign({}, constants.SUPPORTED_SEARCH_FILTERS);
      expect(instance.handleFiltersChange.callCount).to.equal(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).to.deep.equal(emptyFilters);
    });

    it('calls disableGeoposition with empty filters', () => {
      expect(disableGeoposition.callCount).to.equal(1);
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
