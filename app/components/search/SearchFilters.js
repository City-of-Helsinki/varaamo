import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

export class SearchFilters extends Component {
  render() {
    const {
      isFetchingPurposes,
      onPurposeFilterChange,
      purposeFilter,
      purposeOptions,
    } = this.props;

    return (
      <div>
        <h4>Käyttötarkoitus</h4>
        <Select
          clearable={true}
          isLoading={isFetchingPurposes}
          name="purpose-filter-select"
          onChange={onPurposeFilterChange}
          options={purposeOptions}
          placeholder="Rajaa hakutuloksia käyttötarkoituksen mukaan"
          value={purposeFilter}
        />
      </div>
    );
  }
}

SearchFilters.propTypes = {
  isFetchingPurposes: PropTypes.bool,
  onPurposeFilterChange: PropTypes.func.isRequired,
  purposeFilter: PropTypes.string.isRequired,
  purposeOptions: PropTypes.array.isRequired,
};

export default SearchFilters;
