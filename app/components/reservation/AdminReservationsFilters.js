import map from 'lodash/collection/map';
import sortBy from 'lodash/collection/sortBy';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import { RESERVATION_STATE_LABELS } from 'constants/AppConstants';

let stateOptions = map(RESERVATION_STATE_LABELS, (value, key) => {
  return {
    label: value.labelText,
    value: key,
  };
});
stateOptions = sortBy(stateOptions, 'label');
stateOptions.unshift({ label: 'Kaikki', value: 'all' });

class AdminReservationsFilters extends Component {
  render() {
    const {
      onFiltersChange,
      filters,
    } = this.props;

    return (
      <div style={{ marginBottom: '20px' }}>
        <h4>Varauksen status</h4>
        <Select
          clearable={false}
          name="reservation-state-filter-select"
          onChange={(value) => onFiltersChange({ state: value })}
          options={stateOptions}
          value={filters.state}
        />
      </div>
    );
  }
}

AdminReservationsFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export default AdminReservationsFilters;
