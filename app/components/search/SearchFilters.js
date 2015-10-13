import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

export class SearchFilters extends Component {
  render() {
    const {
      isFetchingPurposes,
      onFiltersChange,
      filters,
      purposeOptions,
    } = this.props;

    return (
      <div>
        <h4>Käyttötarkoitus</h4>
        <Select
          clearable
          isLoading={isFetchingPurposes}
          name="purpose-filter-select"
          onChange={(value) => onFiltersChange({ purpose: value })}
          options={purposeOptions}
          placeholder="Rajaa hakutuloksia käyttötarkoituksen mukaan"
          value={filters.purpose}
        />
      </div>
    );
  }
}

SearchFilters.propTypes = {
  isFetchingPurposes: PropTypes.bool.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  purposeOptions: PropTypes.array.isRequired,
};

export default SearchFilters;
