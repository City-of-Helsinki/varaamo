import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import Select from 'react-select';

class SearchFilters extends Component {
  render() {
    const {
      isFetchingPurposes,
      onFiltersChange,
      filters,
      purposeOptions,
    } = this.props;

    return (
      <div style={{ marginBottom: '20px' }}>
        <h4>Tilan käyttötarkoitus</h4>
        <Select
          clearable
          isLoading={isFetchingPurposes}
          name="purpose-filter-select"
          onChange={(value) => onFiltersChange({ purpose: value })}
          options={purposeOptions}
          placeholder=" "
          value={filters.purpose}
        />
        <h4>Tilan henkilömäärä vähintään</h4>
        <Input
          min="0"
          name="people-capacity-filter"
          onChange={(event) => onFiltersChange({ people: event.target.value })}
          type="number"
          value={filters.people}
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
