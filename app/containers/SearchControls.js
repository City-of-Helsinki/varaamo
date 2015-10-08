import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import { fetchResources } from 'actions/resourceActions';
import { changeSearchFilters } from 'actions/uiActions';
import SearchFilters from 'components/search/SearchFilters';
import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

export class UnconnectedSearchControls extends Component {
  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  render() {
    const {
      actions,
      filters,
      isFetchingPurposes,
      purposeOptions,
    } = this.props;

    function onFiltersChange(newFilters) {
      actions.changeSearchFilters(newFilters);
      const allFilters = Object.assign({}, filters, newFilters);
      actions.fetchResources(allFilters);
    }

    return (
      <div>
        <SearchFilters
          isFetchingPurposes={isFetchingPurposes}
          onFiltersChange={onFiltersChange}
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
