import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';

import constants from '../../../../app/constants/AppConstants';
import * as searchUtils from '../utils';
import injectT from '../../../../app/i18n/injectT';
import TextFilter from './filter/TextFilter';
import DateFilter from './filter/DateFilter';
import SelectFilter from './filter/SelectFilter';
import ToggleFilter from './filter/ToggleFilter';
import TimeRangeFilter from './filter/TimeRangeFilter';
import PositionControl from '../../../../app/pages/search/controls/PositionControl';
import iconTimes from './images/times.svg';

class SearchFilters extends React.Component {
  static propTypes = {
    filters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    isGeolocationEnabled: PropTypes.bool,
    onGeolocationToggle: PropTypes.func.isRequired,
    isLoadingPurposes: PropTypes.bool,
    isLoadingUnits: PropTypes.bool,
    units: PropTypes.array.isRequired,
    purposes: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters,
    };
  }

  componentDidUpdate(prevProps) {
    const { filters } = this.props;

    // TODO: This is an anti pattern, so we should find a better way of doing this.
    if (!isEqual(filters, prevProps.filters)) {
      // eslint-disable-next-line
      this.setState({
        filters,
      });
    }
  }

  onFilterChange = (filterName, filterValue) => {
    const { filters } = this.state;

    const newFilters = {
      ...omit(filters, filterName),
    };

    if (filterValue) {
      newFilters[filterName] = filterValue;
    }

    this.setState({
      filters: newFilters,
    });
  };

  onSearch = () => {
    const { onChange } = this.props;
    const { filters } = this.state;

    onChange(omit(filters, 'page'));
  };

  onReset = () => {
    const { onChange } = this.props;

    onChange({});
  };

  hasFilters = () => {
    const { filters } = this.props;

    return !isEmpty(omit(filters, 'page'));
  };

  render() {
    const {
      t,
      intl,
      isGeolocationEnabled,
      isLoadingPurposes,
      isLoadingUnits,
      purposes,
      units,
      onGeolocationToggle,
    } = this.props;
    const {
      filters,
    } = this.state;

    const date = get(filters, 'date', moment().format(constants.DATE_FORMAT));
    const municipality = get(filters, 'municipality', '');
    const availableBetween = get(filters, 'availableBetween', '');

    return (
      <div className="app-SearchFilters">
        <Grid>
          <div className="app-SearchFilters__content">
            <h1>{t('SearchFilters.title')}</h1>
            <Row>
              <Col className="app-SearchFilters__control" md={6} sm={12}>
                <TextFilter
                  id="searchField"
                  label={t('SearchFilters.searchLabel')}
                  onChange={value => this.onFilterChange('search', value)}
                  onSearch={() => this.onSearch()}
                  value={get(filters, 'search', '')}
                />
              </Col>
              <Col className="app-SearchFilters__control" md={6} sm={12}>
                <DateFilter
                  date={moment(get(filters, 'date', new Date())).toDate()}
                  label={t('SearchFilters.dateLabel')}
                  onChange={(newValue) => {
                    this.onFilterChange('date', moment(newValue).format(constants.DATE_FORMAT));
                  }}
                />
              </Col>
            </Row>
            <Panel
              defaultExpanded={this.hasFilters()}
              header={t('SearchFilters.advancedSearch')}
            >
              <Row>
                <Col md={12}>
                  <SelectFilter
                    id="municipality"
                    isMulti
                    label={t('SearchFilters.municipalityLabel')}
                    onChange={(items) => {
                      this.onFilterChange(
                        'municipality',
                        items ? items.map(item => item.value).join(',') : null
                      );
                    }}
                    options={searchUtils.getMunicipalityOptions()}
                    value={municipality.split(',')}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchFilters__control" md={4} sm={12}>
                  <SelectFilter
                    id="purpose"
                    isLoading={isLoadingPurposes}
                    label={t('SearchFilters.purposeLabel')}
                    name="app-SearchFilters-purpose-select"
                    onChange={item => this.onFilterChange('purpose', item.value)}
                    options={searchUtils.getPurposeOptions(purposes, intl.locale)}
                    value={filters.purpose}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <SelectFilter
                    id="unit"
                    isLoading={isLoadingUnits}
                    label={t('SearchFilters.unitLabel')}
                    name="app-SearchControls-unit-select"
                    onChange={item => this.onFilterChange('unit', item.value)}
                    options={searchUtils.getUnitOptions(units, intl.locale)}
                    value={filters.unit}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <SelectFilter
                    id="people"
                    label={t('SearchFilters.peopleCapacityLabel')}
                    name="app-SearchFilters-people-select"
                    onChange={item => this.onFilterChange('people', item.value)}
                    options={searchUtils.getPeopleCapacityOptions()}
                    value={Number(get(filters, 'people'))}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <PositionControl
                    geolocated={isGeolocationEnabled}
                    onConfirm={value => this.onFilterChange('distance', value)}
                    onPositionSwitch={() => {
                      if (isGeolocationEnabled) {
                        this.onFilterChange('distance', null);
                      }

                      onGeolocationToggle();
                    }}
                    value={parseInt(filters.distance, 10)}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <TimeRangeFilter
                    date={date}
                    label={t('TimeRangeControl.timeRangeTitle')}
                    onChange={value => this.onFilterChange('availableBetween', value)}
                    value={availableBetween}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={12}>
                  <ToggleFilter
                    checked={!!get(filters, 'freeOfCharge', false)}
                    id="charge"
                    label={t('SearchFilters.chargeLabel')}
                    onChange={checked => this.onFilterChange('freeOfCharge', checked)}
                  />
                </Col>
              </Row>
            </Panel>
            <Row className="app-SearchFilters__buttons">
              <Col sm={12}>
                <Button
                  bsStyle="primary"
                  className="app-SearchFilters__submit-button"
                  key="submit-button"
                  onClick={() => this.onSearch()}
                  type="submit"
                >
                  {t('SearchFilters.searchButton')}
                </Button>
                {this.hasFilters() && (
                  <Button
                    bsStyle="link"
                    className="app-SearchFilters__reset-button"
                    key="reset-button"
                    onClick={() => this.onReset()}
                  >
                    <img alt="" src={iconTimes} />
                    {t('SearchFilters.resetButton')}
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

const ISearchFilters = injectT(SearchFilters);
export { ISearchFilters };
export default injectIntl(ISearchFilters);
