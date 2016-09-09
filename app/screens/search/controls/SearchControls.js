import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import { DateField } from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { fetchPurposes } from 'actions/purposeActions';
import { changeSearchFilters } from 'actions/uiActions';
import SearchFilters from 'components/search/SearchFilters';
import searchControlsSelector from './searchControlsSelector';

export class UnconnectedSearchControls extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  componentDidMount() {
    const { actions, urlSearchFilters } = this.props;

    actions.changeSearchFilters(urlSearchFilters);
    actions.fetchPurposes();
  }

  onDateChange(newDate) {
    this.onFiltersChange({ date: newDate });
    this.handleSearch({ date: newDate }, { preventScrolling: true });
  }

  onFiltersChange(newFilters) {
    this.props.actions.changeSearchFilters(newFilters);
  }

  handleSearch(newFilters, options = {}) {
    const { actions, scrollToSearchResults } = this.props;
    let filters;
    if (newFilters) {
      filters = Object.assign({}, this.props.filters, newFilters);
    } else {
      filters = this.props.filters;
    }

    actions.updatePath(`/search?${queryString.stringify(filters)}`);
    if (!options.preventScrolling) {
      scrollToSearchResults();
    }
  }

  handleSearchInputChange(event) {
    const value = event.target.value;
    this.onFiltersChange({ search: value });
    if (event.keyCode === 13) {
      this.handleSearch();
    }
  }

  render() {
    const {
      filters,
      isFetchingPurposes,
      purposeOptions,
    } = this.props;

    return (
      <div>
        <Row>
          <Col lg={6} md={6}>
            <Input
              autoFocus={!filters.purpose}
              onChange={(event) => this.onFiltersChange({ search: event.target.value })}
              onKeyUp={this.handleSearchInputChange}
              placeholder="Esim. kokous, työskentely"
              type="text"
              value={filters.search}
            />
          </Col>
          <Col lg={6} md={6}>
            <div className="form-group">
              <DateField
                clearIcon={false}
                collapseOnDateClick
                dateFormat="YYYY-MM-DD"
                defaultValue={this.props.filters.date}
                footer={false}
                onChange={this.onDateChange}
                updateOnDateClick
              />
            </div>
          </Col>
        </Row>
        <Panel
          collapsible
          defaultExpanded={Boolean(filters.purpose)}
          header="Tarkennettu haku"
        >
          <SearchFilters
            isFetchingPurposes={isFetchingPurposes}
            onFiltersChange={this.onFiltersChange}
            purposeOptions={purposeOptions}
            filters={this.props.filters}
          />
        </Panel>
        <Button
          block
          bsStyle="primary"
          className="search-button"
          onClick={() => this.handleSearch()}
          type="submit"
        >
          Hae
        </Button>
      </div>
    );
  }
}

UnconnectedSearchControls.propTypes = {
  actions: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  purposeOptions: PropTypes.array.isRequired,
  scrollToSearchResults: PropTypes.func.isRequired,
  typeaheadOptions: PropTypes.array.isRequired,
  urlSearchFilters: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchPurposes,
    updatePath,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchControlsSelector, mapDispatchToProps)(UnconnectedSearchControls);
