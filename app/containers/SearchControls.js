import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-date-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import { fetchResources } from 'actions/resourceActions';
import { changeSearchFilters } from 'actions/uiActions';
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

    actions.changeSearchFilters(newFilters);
    actions.fetchResources(fetchParams);
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
          onSubmit={(searchValue) => this.onFiltersChange({ search: searchValue })}
          initialValue={filters.search}
        />
        <SearchFilters
          isFetchingPurposes={isFetchingPurposes}
          onFiltersChange={this.onFiltersChange}
          purposeOptions={purposeOptions}
          filters={filters}
        />
        <DateHeader
          date={filters.date}
          onChange={(newDate) => this.onFiltersChange({ date: newDate })}
        />
        <DatePicker
          date={filters.date}
          hideFooter
          gotoSelectedText="Mene valittuun"
          onChange={(newDate) => this.onFiltersChange({ date: newDate })}
          todayText="Tänään"
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
    changeSearchFilters,
    fetchPurposes,
    fetchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchControlsSelector, mapDispatchToProps)(UnconnectedSearchControls);
