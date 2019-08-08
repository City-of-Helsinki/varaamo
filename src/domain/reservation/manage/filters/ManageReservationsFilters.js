import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { injectIntl, intlShape } from 'react-intl';
import {
  Row,
  Col,
  Grid,
} from 'react-bootstrap';

import injectT from '../../../../../app/i18n/injectT';
import TextField from '../../../../common/form/fields/TextField';
import ButtonGroupField from '../../../../common/form/fields/ButtonGroupField';
import SelectField from '../../../../common/form/fields/SelectField';
import iconTimes from '../../../search/filters/images/times.svg';
import * as dataUtils from '../../../../common/data/utils';

class ManageReservationsFilters extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    filters: PropTypes.object,
    units: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    intl: intlShape,
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
      units,
      intl,
    } = this.props;

    const state = get(filters, 'state', null);
    const locale = intl.locale;

    return (
      <div className="app-ManageReservationsFilters">
        <Grid>
          <Row>
            <Col md={8}>
              <Row>
                <Col md={12}>
                  <ButtonGroupField
                    id="stateField"
                    label={t('ManageReservationsFilters.statusLabel')}
                    onChange={value => this.onFilterChange('state', value)}
                    options={this.getStatusOptions()}
                    type="checkbox"
                    value={state ? state.split(',') : null}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SelectField
                    id="unitField"
                    label={t('ManageReservationsFilters.unitLabel')}
                    onChange={option => this.onFilterChange('unit', option.value)}
                    options={units.map(unit => ({
                      value: unit.id,
                      label: dataUtils.getLocalizedFieldValue(unit.name, locale)
                    }))}
                    value={get(filters, 'unit', null)}
                  />
                </Col>
              </Row>
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

export default injectT(injectIntl(ManageReservationsFilters));
