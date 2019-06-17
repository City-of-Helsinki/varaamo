import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Grid from 'react-bootstrap/lib/Grid';

import constants from '../../../../app/constants/AppConstants';
import injectT from '../../../../app/i18n/injectT';
import TextFilter from './filter/TextFilter';
import DateFilter from './filter/DateFilter';
import SelectControl from '../../../../app/pages/search/controls/SelectControl';
import PositionControl from '../../../../app/pages/search/controls/PositionControl';
import TimeRangeControl from '../../../../app/pages/search/controls/TimeRangeControl';
import CheckboxControl from '../../../../app/pages/search/controls/CheckboxControl';
import iconTimes from '../../../../app/pages/search/controls/images/times.svg';

class SearchFilters extends React.Component {
  static propTypes = {
    filters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters,
    };
  }

  componentDidUpdate(prevProps) {
    const { filters } = this.props;

    if (prevProps.filters !== filters) {
      this.setState({
        filters,
      });
    }
  }

  onFilterChange = (filterName, filterValue) => {
    const { filters } = this.state;

    this.setState({
      filters: {
        ...filters,
        [filterName]: filterValue,
      },
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
    const { filters } = this.state;

    return !isEmpty(omit(filters, 'page'));
  };

  render() {
    const {
      t,
    } = this.props;
    const { filters } = this.state;

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
                  date={moment(filters.date).toDate()}
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
                  <SelectControl
                    id="municipality"
                    isLoading={false}
                    isMulti
                    label={t('SearchFilters.municipalityLabel')}
                    name="app-SearchControls-municipality-select"
                    onChange={municipalities => this.handleFiltersChange(
                      { municipality: municipalities.map(mun => mun.value) }
                    )}
                    options={[]}
                    value={filters.municipality}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchFilters__control" md={4} sm={12}>
                  <SelectControl
                    id="purpose"
                    isLoading={false}
                    label={t('SearchFilters.purposeLabel')}
                    name="app-SearchFilters-purpose-select"
                    onChange={purpose => this.handleFiltersChange({ purpose: purpose.value })}
                    options={[]}
                    value={filters.purpose}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <SelectControl
                    id="unit"
                    isLoading={false}
                    label={t('SearchFilters.unitLabel')}
                    name="app-SearchControls-unit-select"
                    onChange={unit => this.handleFiltersChange({ unit: unit.value })}
                    options={[]}
                    value={filters.unit}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <SelectControl
                    id="people"
                    isLoading={false}
                    label={t('SearchFilters.peopleCapacityLabel')}
                    name="app-SearchFilters-people-select"
                    onChange={people => this.handleFiltersChange({ people: people.value })}
                    options={[]}
                    value={filters.people ? String(parseInt(filters.people, 10)) : ''}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <PositionControl
                    geolocated={Boolean(false)}
                    onConfirm={distance => () => null}
                    onPositionSwitch={() => null}
                    value={parseInt(filters.distance, 10)}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={6}>
                  <TimeRangeControl
                    duration={parseInt(filters.duration, 10)}
                    end={filters.end}
                    onConfirm={() => null}
                    onTimeRangeSwitch={() => null}
                    start={filters.start}
                    useTimeRange={get(filters, 'useTimeRange', false)}
                  />
                </Col>
                <Col className="app-SearchFilters__control" md={4} sm={12}>
                  <CheckboxControl
                    id="charge"
                    label={t('SearchFilters.chargeLabel')}
                    labelClassName="app-SearchControlsCheckbox__label"
                    onConfirm={value => () => null}
                    toggleClassName="app-SearchControlsCheckbox__toggle"
                    value={!!filters.freeOfCharge}
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

export default injectT(SearchFilters);
