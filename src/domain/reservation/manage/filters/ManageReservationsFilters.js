import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { Row, Col, Grid } from 'react-bootstrap';

import * as searchUtils from '../../../search/utils';
import injectT from '../../../../../app/i18n/injectT';
import TextField from '../../../../common/form/fields/TextField';
import ButtonGroupField from '../../../../common/form/fields/ButtonGroupField';

class ManageReservationsFilters extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    filters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  };

  onFilterChange = (filterName, filterValue) => {
    const {
      filters,
      onChange,
    } = this.props;

    console.warn(filters, filterValue);

    const newFilters = {
      ...omit(filters, filterName),
    };

    if (filterValue) {
      newFilters[filterName] = filterValue;
    }

    onChange(omit(newFilters, 'page'));
  };

  render() {
    const {
      t,
      filters,
    } = this.props;

    return (
      <div className="app-ManageReservationsFilters">
        <Grid>
          <Row>
            <Col>
              <ButtonGroupField
                id="stateField"
                label={t('ManageReservationsFilters.statusLabel')}
                onChange={value => this.onFilterChange('state', value)}
                options={[
                  { value: 'approved', label: 'Approved' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                type="checkbox"
                value={get(filters, 'state', null)}
              />
              <TextField
                id="searchField"
                label={t('ManageReservationsFilters.searchLabel')}
                onChange={event => this.onFilterChange('search', event.target.value)}
                placeholder={t('ManageReservationsFilters.searchPlaceholder')}
                value={get(filters, 'search', '')}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default injectT(ManageReservationsFilters);
