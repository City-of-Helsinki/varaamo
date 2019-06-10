import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import constants from '../../../constants/AppConstants';
import { shallowWithIntl } from '../../../utils/testUtils';
import CheckboxControl from './CheckboxControl';
import DatePickerControl from './DatePickerControl';
import PositionControl from './PositionControl';
import SearchBox from './SearchBox';
import SelectControl from './SelectControl';
import TimeRangeControl from './TimeRangeControl';
import { UnconnectedSearchControlsContainer as SearchControlsContainer } from './SearchControlsContainer';

describe('pages/search/controls/SearchControlsContainer', () => {
  const history = {
    push: () => { },
  };

  const defaultProps = {
    history,
    actions: {
      changeSearchFilters: () => null,
      fetchPurposes: () => null,
      searchResources: () => null,
    },
    currentLanguage: 'fi',
    isFetchingPurposes: false,
    isFetchingUnits: false,
    filters: {
      freeOfCharge: '',
      date: '2015-10-10',
      duration: 0,
      end: '',
      page: 1,
      people: '12',
      purpose: 'some-purpose',
      search: 'search-query',
      start: '',
      unit: 'some-unit',
      municipality: '',
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
    peopleOptions: Immutable([
      { value: '1', label: 'foo' },
      { value: '2', label: 'bar' },
    ]),
    urlSearchFilters: {},
  };

  function getWrapper(props) {
    return shallowWithIntl(<SearchControlsContainer {...defaultProps} {...props} />);
  }

  describe('render', () => {
    test('renders SearchBox with correct props', () => {
      const filters = { ...defaultProps.filters, search: 'my search' };
      const wrapper = getWrapper({ filters });
      const searchBox = wrapper.find(SearchBox);
      const expectedOptions = defaultProps.purposeOptions.concat(defaultProps.unitOptions);
      expect(searchBox).toHaveLength(1);
      expect(typeof searchBox.prop('onChange')).toBe('function');
      expect(searchBox.prop('onSearch')).toBe(wrapper.instance().handleSearch);
      expect(searchBox.prop('options')).toEqual(expectedOptions);
      expect(searchBox.prop('value')).toBe(filters.search);
    });

    test('renders DatePickerControl with correct props', () => {
      const filters = { ...defaultProps.filters, date: '2015-10-10' };
      const wrapper = getWrapper({ filters });
      const datePickerControl = wrapper.find(DatePickerControl);
      expect(datePickerControl).toHaveLength(1);
      expect(datePickerControl.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
      expect(datePickerControl.prop('date')).toBe(moment(filters.date).format('L'));
      expect(datePickerControl.prop('onConfirm')).toBe(wrapper.instance().handleDateChange);
    });

    test('renders SelectControl for municipality with correct props', () => {
      const selectControl = getWrapper({}).find(SelectControl);
      expect(selectControl).toHaveLength(4);
      expect(selectControl.at(0).prop('id')).toBe('municipality');
      expect(selectControl.at(0).prop('label')).toBe('SearchControlsContainer.municipalityLabel');
      expect(selectControl.at(0).prop('onChange')).toBeDefined();
      expect(selectControl.at(1).prop('options')).toBeDefined();
      expect(selectControl.at(0).prop('value')).toBe(defaultProps.filters.municipality);
    });

    test('renders SelectControl for purpose with correct props', () => {
      const selectControl = getWrapper({}).find(SelectControl);
      expect(selectControl).toHaveLength(4);
      expect(selectControl.at(1).prop('id')).toBe('purpose');
      expect(selectControl.at(1).prop('isLoading')).toBe(defaultProps.isFetchingPurposes);
      expect(selectControl.at(1).prop('label')).toBe('SearchControlsContainer.purposeLabel');
      expect(selectControl.at(1).prop('onChange')).toBeDefined();
      expect(selectControl.at(1).prop('options')).toEqual(defaultProps.purposeOptions);
      expect(selectControl.at(1).prop('value')).toBe(defaultProps.filters.purpose);
    });

    test('renders SelectControl for unit with correct props', () => {
      const selectControl = getWrapper({}).find(SelectControl);
      expect(selectControl).toHaveLength(4);
      expect(selectControl.at(2).prop('id')).toBe('unit');
      expect(selectControl.at(2).prop('isLoading')).toBe(defaultProps.isFetchingUnits);
      expect(selectControl.at(2).prop('label')).toBe('SearchControlsContainer.unitLabel');
      expect(selectControl.at(2).prop('onChange')).toBeDefined();
      expect(selectControl.at(2).prop('options')).toEqual(defaultProps.unitOptions);
      expect(selectControl.at(2).prop('value')).toBe(defaultProps.filters.unit);
    });

    test('renders SelectControl for people with correct props', () => {
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
      expect(selectControl).toHaveLength(4);
      expect(selectControl.at(3).prop('id')).toBe('people');
      expect(selectControl.at(3).prop('isLoading')).toBe(defaultProps.isFetchingPurposes);
      expect(selectControl.at(3).prop('label')).toBe('SearchControlsContainer.peopleCapacityLabel');
      expect(selectControl.at(3).prop('onChange')).toBeDefined();
      expect(selectControl.at(3).prop('options')).toEqual(peopleOptions);
      expect(selectControl.at(3).prop('value')).toBe(defaultProps.filters.people);
    });

    test('renders PositionControl with correct props', () => {
      const filters = { ...defaultProps.filters, distance: '5000' };
      const positionControl = getWrapper({
        filters,
        position: { lat: 1, lon: 2 },
      }).find(PositionControl);
      expect(positionControl).toHaveLength(1);
      expect(positionControl.prop('geolocated')).toBe(true);
      expect(positionControl.prop('onConfirm')).toBeDefined();
      expect(positionControl.prop('onPositionSwitch')).toBeDefined();
      expect(positionControl.prop('value')).toBe(5000);
    });

    test('renders TimeRangeControl with correct props', () => {
      const filters = {
        ...defaultProps.filters, duration: 30, end: '23:30', start: '09:00'
      };
      const wrapper = getWrapper({ filters });
      const timeRangeControl = wrapper.find(TimeRangeControl);
      expect(timeRangeControl).toHaveLength(1);
      expect(timeRangeControl.prop('duration')).toBe(filters.duration);
      expect(timeRangeControl.prop('end')).toBe(filters.end);
      expect(timeRangeControl.prop('onConfirm')).toBe(wrapper.instance().handleTimeRangeChange);
      expect(timeRangeControl.prop('onTimeRangeSwitch')).toBe(wrapper.instance().handleTimeRangeSwitch);
      expect(timeRangeControl.prop('start')).toBe(filters.start);
    });

    test('renders CheckboxControl with correct props', () => {
      const filters = { ...defaultProps.filters, freeOfCharge: '' };
      const checkboxControl = getWrapper(filters).find(CheckboxControl);
      expect(checkboxControl).toHaveLength(1);
      expect(checkboxControl.prop('id')).toBe('charge');
      expect(checkboxControl.prop('label')).toBe('SearchControlsContainer.chargeLabel');
      expect(typeof checkboxControl.prop('onConfirm')).toBe('function');
      expect(checkboxControl.prop('value')).toBe(false);
    });

    test('renders search Button with correct props', () => {
      const buttons = getWrapper({}).find(Button);
      expect(buttons).toHaveLength(2);
      expect(buttons.at(0).prop('bsStyle')).toBe('primary');
      expect(typeof buttons.at(0).prop('onClick')).toBe('function');
      expect(buttons.at(0).prop('type')).toBe('submit');
    });

    test('renders reset Button with correct props', () => {
      const wrapper = getWrapper({});
      const instance = wrapper.instance();
      const buttons = wrapper.find(Button);
      expect(buttons).toHaveLength(2);
      expect(buttons.at(1).prop('bsStyle')).toBe('link');
      expect(buttons.at(1).prop('onClick')).toBe(instance.handleReset);
    });
  });

  describe('SelectControl onConfirm', () => {
    let instance;
    let selectControl;

    beforeAll(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleFiltersChange = simple.mock();
      selectControl = wrapper.find(SelectControl);
    });

    afterAll(() => {
      simple.restore();
    });

    afterEach(() => {
      instance.handleFiltersChange.reset();
    });

    test('calls handleFiltersChange on miniciple SelectControl onChange', () => {
      const municipalities = [{
        value: 'some-municipality',
        label: 'some-municipality',
      }];
      expect(selectControl).toHaveLength(4);
      expect(typeof selectControl.at(0).prop('onChange')).toBe('function');
      selectControl.at(0).prop('onChange')(municipalities, {});
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual({
        municipality: [municipalities[0].value],
      });
    });

    test('calls handleFiltersChange on purpose SelectControl onChange', () => {
      const purpose = defaultProps.purposeOptions[0];
      expect(selectControl).toHaveLength(4);
      expect(typeof selectControl.at(1).prop('onChange')).toBe('function');
      selectControl.at(1).prop('onChange')(purpose);
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual({
        purpose: purpose.value,
      });
    });

    test('calls handleFiltersChange on unit SelectControl onChange', () => {
      const unit = defaultProps.unitOptions[0];

      expect(selectControl).toHaveLength(4);
      expect(typeof selectControl.at(2).prop('onChange')).toBe('function');
      selectControl.at(2).prop('onChange')(unit);
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual({ unit: unit.value });
    });

    test('calls handleFiltersChange on people SelectControl onChange', () => {
      const people = defaultProps.peopleOptions[0];
      expect(selectControl).toHaveLength(4);
      expect(typeof selectControl.at(3).prop('onChange')).toBe('function');
      selectControl.at(3).prop('onChange')(people);
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual({ people: people.value });
    });
  });

  describe('PositionControl onConfirm', () => {
    let positionControl;
    let instance;

    beforeAll(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleFiltersChange = simple.mock();
      positionControl = wrapper.find(PositionControl);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleFiltersChange on PositionControl onConfirm', () => {
      const distance = 1000;
      expect(positionControl).toHaveLength(1);
      expect(typeof positionControl.at(0).prop('onConfirm')).toBe('function');
      positionControl.at(0).prop('onConfirm')(distance);
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual({ distance });
    });
  });

  describe('CheckboxControl onConfirm', () => {
    let checkboxControl;
    let instance;

    beforeAll(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleFiltersChange = simple.mock();
      checkboxControl = wrapper.find(CheckboxControl);
    });

    afterAll(() => {
      simple.restore();
    });

    test(
      'calls handleFiltersChange on charge CheckboxControl control onConfirm',
      () => {
        const freeOfCharge = true;
        expect(checkboxControl).toHaveLength(1);
        expect(typeof checkboxControl.at(0).prop('onConfirm')).toBe('function');
        checkboxControl.at(0).prop('onConfirm')(freeOfCharge);
        expect(instance.handleFiltersChange.callCount).toBe(1);
        expect(instance.handleFiltersChange.lastCall.args[0]).toEqual({ freeOfCharge });
      }
    );
  });

  describe('handleDateChange', () => {
    const { date } = defaultProps.filters;
    const expected = { date };
    let instance;

    beforeAll(() => {
      instance = getWrapper().instance();
      instance.handleFiltersChange = simple.mock();
      instance.handleDateChange(defaultProps.filters);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleFiltersChange with given filters', () => {
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual(expected);
    });
  });

  describe('handleFiltersChange', () => {
    test('calls props actions changeSearchFilters with given filters', () => {
      const newFilters = { search: 'new search value' };
      const changeSearchFilters = simple.mock();
      const instance = getWrapper({ actions: { changeSearchFilters } }).instance();
      instance.handleFiltersChange(newFilters);
      expect(changeSearchFilters.callCount).toBe(1);
      expect(changeSearchFilters.lastCall.args[0]).toBe(newFilters);
    });
  });

  describe('handlePositionSwitch', () => {
    test('calls props actions enableGeoposition when no position', () => {
      const enableGeoposition = simple.mock();
      const disableGeoposition = simple.mock();
      const props = {
        actions: { enableGeoposition, disableGeoposition },
      };
      const instance = getWrapper(props).instance();
      instance.handlePositionSwitch();
      expect(enableGeoposition.callCount).toBe(1);
      expect(disableGeoposition.callCount).toBe(0);
    });
    test('calls props actions disableGeoposition when position', () => {
      const enableGeoposition = simple.mock();
      const disableGeoposition = simple.mock();
      const props = {
        actions: { enableGeoposition, disableGeoposition },
        position: { lat: 1, lon: 2 },
      };
      const instance = getWrapper(props).instance();
      instance.handlePositionSwitch();
      expect(disableGeoposition.callCount).toBe(1);
      expect(enableGeoposition.callCount).toBe(0);
    });
  });

  describe('handleSearchBoxChange', () => {
    test('calls props actions changeSearchFilters with given filters', () => {
      const search = 'new search value';
      const changeSearchFilters = simple.mock();
      const instance = getWrapper({ actions: { changeSearchFilters } }).instance();
      instance.handleSearchBoxChange(search);
      expect(changeSearchFilters.callCount).toBe(1);
      expect(changeSearchFilters.lastCall.args[0]).toEqual({ search });
    });
  });

  describe('Search button onClick', () => {
    let buttons;
    let instance;

    beforeAll(() => {
      const wrapper = getWrapper();
      instance = wrapper.instance();
      instance.handleSearch = simple.mock();
      buttons = wrapper.find(Button);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleSearch on search button onClick', () => {
      expect(buttons).toHaveLength(2);
      expect(typeof buttons.at(0).prop('onClick')).toBe('function');
      buttons.at(0).prop('onClick')();
      expect(instance.handleSearch.callCount).toBe(1);
    });
  });

  describe('handleSearch', () => {
    const newFilters = {};
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'push');
      getWrapper()
        .instance()
        .handleSearch(newFilters);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory.push with correct path', () => {
      const actualPath = historyMock.lastCall.args[0];
      const expectedPath = `/search?${queryString.stringify(defaultProps.filters)}`;

      expect(historyMock.callCount).toBe(1);
      expect(actualPath).toBe(expectedPath);
    });
  });

  describe('handleReset', () => {
    const disableGeoposition = simple.mock();
    let instance;

    beforeAll(() => {
      const props = {
        actions: { disableGeoposition },
        position: { lat: 1, lon: 2 },
      };
      instance = getWrapper(props).instance();
      instance.handleFiltersChange = simple.mock();
      instance.handleSearch = simple.mock();
      instance.handleReset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls handleSearch with empty filters', () => {
      const emptyFilters = Object.assign({}, constants.SUPPORTED_SEARCH_FILTERS);
      expect(instance.handleSearch.callCount).toBe(1);
      expect(instance.handleSearch.lastCall.args[0]).toEqual(emptyFilters);
    });

    test('calls handleFiltersChange with empty filters', () => {
      const emptyFilters = Object.assign({}, constants.SUPPORTED_SEARCH_FILTERS);
      expect(instance.handleFiltersChange.callCount).toBe(1);
      expect(instance.handleFiltersChange.lastCall.args[0]).toEqual(emptyFilters);
    });

    test('calls disableGeoposition with empty filters', () => {
      expect(disableGeoposition.callCount).toBe(1);
    });
  });

  describe('componentDidMount', () => {
    test('fetches resources when component mounts', () => {
      const actions = {
        fetchPurposes: simple.mock(),
        changeSearchFilters: () => null,
      };
      getWrapper({ actions })
        .instance()
        .componentDidMount();

      expect(actions.fetchPurposes.callCount).toBe(1);
    });
  });

  describe('getMunicipalityOptions', () => {
    test('return options default from 3 central cities', () => {
      const instance = getWrapper().instance();
      const options = instance.getMunicipalityOptions();

      expect(options[0].label).toEqual(constants.DEFAULT_MUNICIPALITY_OPTIONS[0]);
    });

    test('return options custom from env', () => {
      const instance = getWrapper().instance();

      global.SETTINGS = {
        CUSTOM_MUNICIPALITY_OPTIONS: ['Foo', 'Bar']
      };

      const options = instance.getMunicipalityOptions();

      expect(options[0].label).toEqual('Foo');
    });

    test('doesnt work with empty array', () => {
      const instance = getWrapper().instance();

      global.SETTINGS = {
        CUSTOM_MUNICIPALITY_OPTIONS: []
      };

      const options = instance.getMunicipalityOptions();

      expect(options[0].label).toEqual(constants.DEFAULT_MUNICIPALITY_OPTIONS[0]);
    });

    test('use default in case of error, bad env var', () => {
      const instance = getWrapper().instance();

      global.SETTINGS = {
        CUSTOM_MUNICIPALITY_OPTIONS: 'fooo'
      };

      const options = instance.getMunicipalityOptions();

      expect(options[0].label).toEqual(constants.DEFAULT_MUNICIPALITY_OPTIONS[0]);
    });

    test('still work if value is number instead of string', () => {
      const instance = getWrapper().instance();

      global.SETTINGS = {
        CUSTOM_MUNICIPALITY_OPTIONS: [123, 456]
      };

      const options = instance.getMunicipalityOptions();

      expect(options[0].label).toEqual('123');
    });

    test('label is capitalized, value is in lowercase', () => {
      const instance = getWrapper().instance();

      global.SETTINGS = {
        CUSTOM_MUNICIPALITY_OPTIONS: ['foo']
      };

      const options = instance.getMunicipalityOptions();

      expect(options[0].label).toEqual('Foo');
      expect(options[0].value).toEqual('foo');
    });

    afterAll(() => {
      delete global.SETTINGS;
    });
  });
});
