import constants from 'constants/AppConstants';

import range from 'lodash/range';
import moment from 'moment';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import { fetchPurposes } from 'actions/purposeActions';
import {
  changeSearchFilters,
  disableGeoposition,
  disableTimeRange,
  enableGeoposition,
  enableTimeRange,
} from 'actions/uiActions';
import { injectT } from 'i18n';
import CheckboxControl from './CheckboxControl';
import DatePickerControl from './DatePickerControl';
import PositionControl from './PositionControl';
import SearchBox from './SearchBox';
import searchControlsSelector from './searchControlsSelector';
import SelectControl from './SelectControl';
import TimeRangeControl from './TimeRangeControl';
import iconTimes from './images/times.svg';

class UnconnectedSearchControlsContainer extends Component {
  componentDidMount() {
    const { actions, urlSearchFilters } = this.props;
    actions.changeSearchFilters(urlSearchFilters);
    actions.fetchPurposes();
  }

  getPeopleCapacityOption(val) {
    const value = String(val);
    return { label: value, value };
  }

  getPeopleCapacityOptions() {
    const options = range(1, 10).map(this.getPeopleCapacityOption);
    range(10, 30, 5).forEach((value) => {
      options.push(this.getPeopleCapacityOption(value));
    });
    options.push({ label: '30+', value: '30' });
    return options;
  }

  getMunicipalityOptions = () => constants.SEARCH_MUNICIPALITY_OPTIONS.map(municipality => ({
    value: municipality.toLowerCase(),
    label: municipality,
  }));

  hasAdvancedFilters() {
    const { filters, position } = this.props;
    let hasFilters = Boolean(position);
    ['freeOfCharge', 'end', 'distance', 'duration', 'purpose', 'start', 'unit'].forEach((key) => {
      if (filters[key]) {
        hasFilters = true;
      }
    });
    return hasFilters;
  }

  handleDateChange = ({ date }) => {
    const dateInCorrectFormat = moment(date, 'L').format(constants.DATE_FORMAT);
    this.handleFiltersChange({
      date: dateInCorrectFormat,
    });
  };

  handleFiltersChange = (newFilters) => {
    this.props.actions.changeSearchFilters(newFilters);
  };

  handlePositionSwitch = () => {
    if (!this.props.position) {
      this.props.actions.enableGeoposition();
    } else {
      this.props.actions.disableGeoposition();
    }
  };

  handleSearchBoxChange = (value) => {
    this.props.actions.changeSearchFilters({ search: value });
  };

  handleTimeRangeChange = ({ duration, end, start }) => {
    this.handleFiltersChange({
      duration,
      end,
      start,
    });
  };

  handleTimeRangeSwitch = (value) => {
    if (value) {
      this.props.actions.enableTimeRange();
    } else {
      this.props.actions.disableTimeRange();
    }
  };

  handleSearch = (newFilters = {}) => {
    const page = 1;
    const filters = { ...this.props.filters, ...newFilters, page };
    this.props.history.push(`/search?${queryString.stringify(filters)}`);
  };

  handleReset = () => {
    const emptyFilters = Object.assign({}, constants.SUPPORTED_SEARCH_FILTERS);
    if (this.props.position) {
      this.props.actions.disableGeoposition();
    }

    this.handleFiltersChange(emptyFilters);
  };

  render() {
    const {
      currentLanguage,
      filters,
      isFetchingPurposes,
      isFetchingUnits,
      purposeOptions,
      t,
      unitOptions,
    } = this.props;
    const peopleCapacityOptions = this.getPeopleCapacityOptions();
    const searchBoxOptions = purposeOptions.concat(unitOptions);
    const hasFilters = this.hasAdvancedFilters();

    return (
      <div className="app-SearchControlsContainer">
        <Grid>
          <div className="app-SearchControlsContainer__content">
            <h1>{t('SearchControlsContainer.title')}</h1>
            <Row>
              <Col className="app-SearchControlsContainer__control" md={6} sm={12}>
                <SearchBox
                  onChange={this.handleSearchBoxChange}
                  onSearch={this.handleSearch}
                  options={searchBoxOptions}
                  value={filters.search}
                />
              </Col>
              <Col className="app-SearchControlsContainer__control" md={6} sm={12}>
                <DatePickerControl
                  currentLanguage={currentLanguage}
                  date={moment(filters.date).format('L')}
                  onConfirm={this.handleDateChange}
                />
              </Col>
            </Row>
            <Panel
              collapsible
              defaultExpanded={hasFilters}
              header={t('SearchControlsContainer.advancedSearch')}
            >
              <Row>
                <Col md={12}>
                  <SelectControl
                    id="municipality"
                    isLoading={isFetchingUnits}
                    isMulti
                    label={t('SearchControlsContainer.municipalityLabel')}
                    name="app-SearchControls-municipality-select"
                    onChange={municipalities => this.handleFiltersChange(
                      { municipality: municipalities.map(mun => mun.value) }
                    )}
                    options={this.getMunicipalityOptions()}
                    value={filters.municipality}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchControlsContainer__control" md={4} sm={12}>
                  <SelectControl
                    id="purpose"
                    isLoading={isFetchingPurposes}
                    label={t('SearchControlsContainer.purposeLabel')}
                    name="app-SearchControls-purpose-select"
                    onChange={purpose => this.handleFiltersChange({ purpose: purpose.value })}
                    options={purposeOptions}
                    value={filters.purpose}
                  />
                </Col>
                <Col className="app-SearchControlsContainer__control" md={4} sm={6}>
                  <SelectControl
                    id="unit"
                    isLoading={isFetchingUnits}
                    label={t('SearchControlsContainer.unitLabel')}
                    name="app-SearchControls-unit-select"
                    onChange={unit => this.handleFiltersChange({ unit: unit.value })}
                    options={unitOptions}
                    value={filters.unit}
                  />
                </Col>
                <Col className="app-SearchControlsContainer__control" md={4} sm={6}>
                  <SelectControl
                    id="people"
                    isLoading={isFetchingUnits}
                    label={t('SearchControlsContainer.peopleCapacityLabel')}
                    name="app-SearchControls-people-select"
                    onChange={people => this.handleFiltersChange({ people: people.value })}
                    options={peopleCapacityOptions}
                    value={filters.people ? String(parseInt(filters.people, 10)) : ''}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchControlsContainer__control" md={4} sm={6}>
                  <PositionControl
                    geolocated={Boolean(this.props.position)}
                    onConfirm={distance => this.handleFiltersChange({ distance })}
                    onPositionSwitch={this.handlePositionSwitch}
                    value={parseInt(filters.distance, 10)}
                  />
                </Col>
                <Col className="app-SearchControlsContainer__control" md={4} sm={6}>
                  <TimeRangeControl
                    duration={parseInt(filters.duration, 10)}
                    end={filters.end}
                    onConfirm={this.handleTimeRangeChange}
                    onTimeRangeSwitch={this.handleTimeRangeSwitch}
                    start={filters.start}
                    useTimeRange={filters.useTimeRange}
                  />
                </Col>
                <Col className="app-SearchControlsContainer__control" md={4} sm={12}>
                  <CheckboxControl
                    id="charge"
                    label={t('SearchControlsContainer.chargeLabel')}
                    labelClassName="app-SearchControlsCheckbox__label"
                    onConfirm={value => this.handleFiltersChange({ freeOfCharge: value })}
                    toggleClassName="app-SearchControlsCheckbox__toggle"
                    value={!!filters.freeOfCharge}
                  />
                </Col>
              </Row>
            </Panel>
            <Row className="app-SearchControlsContainer__buttons">
              <Col sm={12}>
                <Button
                  bsStyle="primary"
                  className="app-SearchControlsContainer__submit-button"
                  key="submit-button"
                  onClick={() => this.handleSearch()}
                  type="submit"
                >
                  {t('SearchControlsContainer.searchButton')}
                </Button>
                {hasFilters && (
                  <Button
                    bsStyle="link"
                    className="app-SearchControlsContainer__reset-button"
                    key="reset-button"
                    onClick={this.handleReset}
                  >
                    <img alt="" src={iconTimes} />
                    {t('SearchControlsContainer.resetButton')}
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}

UnconnectedSearchControlsContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  isFetchingUnits: PropTypes.bool.isRequired,
  position: PropTypes.object,
  purposeOptions: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  unitOptions: PropTypes.array.isRequired,
  urlSearchFilters: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

UnconnectedSearchControlsContainer = injectT(UnconnectedSearchControlsContainer); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    disableGeoposition,
    disableTimeRange,
    enableGeoposition,
    enableTimeRange,
    fetchPurposes,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedSearchControlsContainer };
export default withRouter(
  connect(
    searchControlsSelector,
    mapDispatchToProps
  )(UnconnectedSearchControlsContainer)
);
