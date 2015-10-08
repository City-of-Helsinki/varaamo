import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import { fetchResources } from 'actions/resourceActions';
import { changePurposeFilter } from 'actions/uiActions';
import SearchFilters from 'components/search/SearchFilters';
import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

export class UnconnectedSearchControls extends Component {
  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  render() {
    const {
      actions,
      isFetchingPurposes,
      purposeFilter,
      purposeOptions,
    } = this.props;

    function onPurposeFilterChange(value) {
      actions.changePurposeFilter(value);
      actions.fetchResources({ purpose: value });
    }

    return (
      <div>
        <SearchFilters
          isFetchingPurposes={isFetchingPurposes}
          onPurposeFilterChange={onPurposeFilterChange}
          purposeOptions={purposeOptions}
          purposeFilter={purposeFilter}
        />
      </div>
    );
  }
}

UnconnectedSearchControls.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool,
  purposeFilter: PropTypes.string.isRequired,
  purposeOptions: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changePurposeFilter,
    fetchPurposes,
    fetchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchControlsSelectors, mapDispatchToProps)(UnconnectedSearchControls);
