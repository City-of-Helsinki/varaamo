import React, { Component, PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import { fetchPurposes } from 'actions/purposeActions';
import { searchResources } from 'actions/searchActions';
import DateHeader from 'components/common/DateHeader';
import SearchFilters from 'components/search/SearchFilters';
import SearchInput from 'components/search/SearchInput';
import searchControlsSelector from 'selectors/containers/searchControlsSelector';
import { getFetchParamsFromFilters } from 'utils/SearchUtils';

export class UnconnectedSearchControls extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.filters;
    this.handleSearch = this.handleSearch.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.filters);
  }

  onFiltersChange(newFilters) {
    this.setState(newFilters);
  }

  changeFiltersAndSearch(newFilters) {
    this.onFiltersChange(newFilters);
    this.handleSearch();
  }

  handleSearch() {
    const { actions } = this.props;
    const filters = this.state;
    const fetchParams = getFetchParamsFromFilters(filters);

    actions.pushState(null, '/search', filters);
    actions.searchResources(fetchParams);
  }

  render() {
    const {
      filters,
      isFetchingPurposes,
      purposeOptions,
    } = this.props;

    return (
      <div>
        <SearchInput
          autoFocus={!Boolean(filters.purpose)}
          onChange={(searchValue) => this.onFiltersChange({ search: searchValue })}
          onSubmit={this.handleSearch}
          value={this.state.search}
        />
        <Panel
          collapsible
          defaultExpanded={Boolean(filters.purpose)}
          header="Tarkennettu haku"
        >
          <SearchFilters
            isFetchingPurposes={isFetchingPurposes}
            onFiltersChange={this.onFiltersChange}
            purposeOptions={purposeOptions}
            filters={this.state}
          />
        </Panel>
        <Button
          block
          bsStyle="primary"
          className="search-button"
          onClick={this.handleSearch}
          type="submit"
        >
          Hae
        </Button>
        <DatePicker
          date={this.state.date}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={(newDate) => this.changeFiltersAndSearch({ date: newDate })}
          todayText="Tänään"
        />
        <DateHeader
          date={this.state.date}
          onChange={(newDate) => this.changeFiltersAndSearch({ date: newDate })}
        />
      </div>
    );
  }
}

UnconnectedSearchControls.propTypes = {
  actions: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  purposeOptions: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchPurposes,
    pushState,
    searchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchControlsSelector, mapDispatchToProps)(UnconnectedSearchControls);
