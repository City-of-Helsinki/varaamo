import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';

class AdminReservationFilters extends Component {
  render() {
    const { filters, onFiltersChange, t } = this.props;
    const stateOptions = [
      {
        label: t('AdminReservationFilters.allOptionLabel'),
        value: 'all',
      },
      ...sortBy(
        map(
          constants.RESERVATION_STATE_LABELS,
          (value, key) => ({
            label: t(value.labelTextId),
            value: key,
          })
        ),
        'label'
      ),
    ];

    return (
      <div className="reservation-filters">
        <h4>{t('AdminReservationFilters.header')}</h4>
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
  t: PropTypes.func.isRequired,
};

export default injectT(AdminReservationFilters);
