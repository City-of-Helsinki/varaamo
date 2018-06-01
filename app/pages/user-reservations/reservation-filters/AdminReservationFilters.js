import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';

class AdminReservationFilters extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ value }) {
    if (value) {
      this.props.onFiltersChange({ state: value });
    }
  }

  render() {
    const { filters, t } = this.props;
    const stateOptions = [
      {
        label: t('common.optionsAllLabel'),
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
        <h4>{t('UserReservationsPage.preliminaryReservationsHeader')}</h4>
        <Select
          className="reservation-state-select"
          clearable={false}
          name="reservation-state-select"
          onChange={this.handleChange}
          options={stateOptions}
          searchable={false}
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
