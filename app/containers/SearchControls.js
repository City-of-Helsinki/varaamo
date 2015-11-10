import React, { Component, PropTypes } from 'react';
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
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  onFiltersChange(newFilters) {
    const { actions, filters } = this.props;
    const allFilters = Object.assign({}, filters, newFilters);
    const fetchParams = getFetchParamsFromFilters(allFilters);

    actions.pushState(null, '/search', allFilters);
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
          onSubmit={(searchValue) => this.onFiltersChange({ search: searchValue })}
          value={filters.search}
        />
        <SearchFilters
          isFetchingPurposes={isFetchingPurposes}
          onFiltersChange={this.onFiltersChange}
          purposeOptions={purposeOptions}
          filters={filters}
        />
        <DatePicker
          date={filters.date}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={(newDate) => this.onFiltersChange({ date: newDate })}
          todayText="Tänään"
        />
        <DateHeader
          date={filters.date}
          onChange={(newDate) => this.onFiltersChange({ date: newDate })}
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
