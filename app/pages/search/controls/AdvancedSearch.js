import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Panel from 'react-bootstrap/lib/Panel';
import Select from 'react-select';

class AdvancedSearch extends Component {
  render() {
    const {
      isFetchingPurposes,
      onFiltersChange,
      filters,
      purposeOptions,
    } = this.props;

    const purposeSelectValue = purposeOptions.some(option => option.value === filters.purpose) ?
      filters.purpose :
      undefined;

    return (
      <Panel
        collapsible
        defaultExpanded={Boolean(purposeSelectValue)}
        header="Tarkennettu haku"
      >
        <h4>Tilan käyttötarkoitus</h4>
        <Select
          clearable
          isLoading={isFetchingPurposes}
          name="purpose-filter-select"
          onChange={option => onFiltersChange({ purpose: option.value })}
          options={purposeOptions}
          placeholder=" "
          searchable={false}
          value={purposeSelectValue}
        />
        <h4>Tilan henkilömäärä vähintään</h4>
        <FormControl
          min="0"
          name="people-capacity-filter"
          onChange={event => onFiltersChange({ people: event.target.value })}
          type="number"
          value={filters.people}
        />
      </Panel>
    );
  }
}

AdvancedSearch.propTypes = {
  isFetchingPurposes: PropTypes.bool.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  purposeOptions: PropTypes.array.isRequired,
};

export default AdvancedSearch;
