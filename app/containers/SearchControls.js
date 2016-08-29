import throttle from 'lodash/throttle';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { fetchPurposes } from 'actions/purposeActions';
import { getTypeaheadSuggestions } from 'actions/searchActions';
import { changeSearchFilters } from 'actions/uiActions';
import DateHeader from 'components/common/DateHeader';
import SearchFilters from 'components/search/SearchFilters';
import SearchInput from 'components/search/SearchInput';
import searchControlsSelector from 'selectors/containers/searchControlsSelector';

export class UnconnectedSearchControls extends Component {
  constructor(props) {
    super(props);
    this.fetchTypeaheadSuggestions = this.fetchTypeaheadSuggestions.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  componentDidMount() {
    const { actions, urlSearchFilters } = this.props;

    actions.changeSearchFilters(urlSearchFilters);
    actions.fetchPurposes();
    this.fetchTypeaheadSuggestions = throttle(
      this.fetchTypeaheadSuggestions, 200, { leading: false, trailing: true }
    );
  }

  onDateChange(newDate) {
    this.onFiltersChange({ date: newDate });
    this.handleSearch({ date: newDate }, { preventScrolling: true });
  }

  onFiltersChange(newFilters) {
    this.props.actions.changeSearchFilters(newFilters);
  }

  fetchTypeaheadSuggestions(value) {
    this.props.actions.getTypeaheadSuggestions({ full: true, input: value });
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

  handleSearchInputChange(value) {
    this.onFiltersChange({ search: value });
    this.fetchTypeaheadSuggestions(value);
  }

  render() {
    const {
      actions,
      filters,
      isFetchingPurposes,
      purposeOptions,
      typeaheadOptions,
    } = this.props;

    return (
      <div>
        <SearchInput
          autoFocus={!filters.purpose}
          onChange={(value) => this.handleSearchInputChange(value)}
          onSubmit={this.handleSearch}
          updatePath={actions.updatePath}
          typeaheadOptions={typeaheadOptions}
          value={this.props.filters.search}
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
        <DatePicker
          date={this.props.filters.date}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={this.onDateChange}
          style={{ height: 210 }}
          todayText="Tänään"
        />
        <DateHeader
          date={this.props.filters.date}
          onChange={this.onDateChange}
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
  scrollToSearchResults: PropTypes.func.isRequired,
  typeaheadOptions: PropTypes.array.isRequired,
  urlSearchFilters: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchPurposes,
    getTypeaheadSuggestions,
    updatePath,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchControlsSelector, mapDispatchToProps)(UnconnectedSearchControls);
