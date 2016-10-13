import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import constants from 'constants/AppConstants';

let stateOptions = map(
  constants.RESERVATION_STATE_LABELS,
  (value, key) => ({
    label: value.labelText,
    value: key,
  })
);
stateOptions = sortBy(stateOptions, 'label');
stateOptions.unshift({ label: 'Kaikki', value: 'all' });

class AdminReservationFilters extends Component {
  render() {
    const { filters, onFiltersChange } = this.props;

    return (
      <div className="reservation-filters">
        <h4>Varauksen status</h4>
        <Select
          className="reservation-state-select"
          clearable={false}
          name="reservation-state-select"
          onChange={option => onFiltersChange({ state: option.value })}
          options={stateOptions}
          value={filters.state}
        />
      </div>
    );
  }
}

AdminReservationFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export default AdminReservationFilters;
