import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import { fetchResources } from 'actions/resourceActions';
import { changeSearchFilters } from 'actions/uiActions';
import SearchFilters from 'components/search/SearchFilters';
import SearchInput from 'components/search/SearchInput';
import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

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

    actions.changeSearchFilters(newFilters);
    actions.fetchResources(allFilters);
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
      </div>
    );
  }
}

UnconnectedSearchControls.propTypes = {
  actions: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool,
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

export default connect(searchControlsSelectors, mapDispatchToProps)(UnconnectedSearchControls);
