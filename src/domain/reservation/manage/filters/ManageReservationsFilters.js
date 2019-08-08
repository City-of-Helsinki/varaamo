import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import {
  Button,
  Row,
  Col,
  Grid,
} from 'react-bootstrap';

import injectT from '../../../../../app/i18n/injectT';
import TextField from '../../../../common/form/fields/TextField';
import ButtonGroupField from '../../../../common/form/fields/ButtonGroupField';
import iconTimes from '../../../search/filters/images/times.svg';

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

    const newFilters = {
      ...omit(filters, filterName),
    };

    if (filterValue && !isEmpty(filterValue)) {
      newFilters[filterName] = filterValue;
    }

    onChange(omit(newFilters, 'page'));
  };

  onReset = () => {
    const { onChange } = this.props;
    onChange({});
  };

  hasFilters = () => {
    const { filters } = this.props;

    return !isEmpty(omit(filters, 'page'));
  };

  getStatusOptions = () => {
    const { t } = this.props;

    return [
      { value: 'confirmed', label: t('Reservation.stateLabelConfirmed') },
      { value: 'cancelled', label: t('Reservation.stateLabelCancelled') },
      { value: 'denied', label: t('Reservation.stateLabelDenied') },
      { value: 'requested', label: t('Reservation.stateLabelRequested') },
    ];
  };

  render() {
    const {
      t,
      filters,
    } = this.props;

    const state = get(filters, 'state', null);

    return (
      <div className="app-ManageReservationsFilters">
        <Grid>
          <Row>
            <Col md={8}>
              <ButtonGroupField
                id="stateField"
                label={t('ManageReservationsFilters.statusLabel')}
                onChange={value => this.onFilterChange('state', value)}
                options={this.getStatusOptions()}
                type="checkbox"
                value={state ? state.split(',') : null}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="searchField"
                label={t('ManageReservationsFilters.searchLabel')}
                onChange={event => this.onFilterChange('search', event.target.value)}
                placeholder={t('ManageReservationsFilters.searchPlaceholder')}
                value={get(filters, 'search', '')}
              />

              {this.hasFilters() && (
                <a
                  className="app-ManageReservationsFilters__resetButton"
                  onClick={() => this.onReset()}
                >
                  <img alt="" src={iconTimes} />
                  {t('ManageReservationsFilters.resetButton')}
                </a>
              )}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default injectT(ManageReservationsFilters);
