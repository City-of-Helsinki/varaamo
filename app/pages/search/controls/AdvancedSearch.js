import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Panel from 'react-bootstrap/lib/Panel';
import Select from 'react-select';

import { injectT } from 'i18n';

class AdvancedSearch extends Component {
  render() {
    const {
      isFetchingPurposes,
      onFiltersChange,
      filters,
      purposeOptions,
      t,
    } = this.props;

    const purposeSelectValue = purposeOptions.some(option => option.value === filters.purpose) ?
      filters.purpose :
      undefined;

    return (
      <Panel
        collapsible
        defaultExpanded={Boolean(purposeSelectValue)}
        header={t('AdvancedSearch.title')}
      >
        <h4>{t('AdvancedSearch.purposeHeader')}</h4>
        <Select
          clearable
          isLoading={isFetchingPurposes}
          name="purpose-filter-select"
          onChange={option => onFiltersChange({ purpose: option ? option.value : '' })}
          options={purposeOptions}
          placeholder=" "
          searchable={false}
          value={purposeSelectValue}
        />
        <h4>{t('AdvancedSearch.peopleCapacityHeader')}</h4>
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
  t: PropTypes.func.isRequired,
};

export default injectT(AdvancedSearch);
