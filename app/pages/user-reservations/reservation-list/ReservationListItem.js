import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import iconHome from 'hel-icons/dist/shapes/home.svg';

import * as dataUtils from '../../../../src/common/data/utils';
import InfoLabel from '../../../../src/common/label/InfoLabel';
import constants from '../../../constants/AppConstants';
import iconCalendar from '../../../assets/icons/calendar.svg';
import ReservationAccessCode from '../../../shared/reservation-access-code/ReservationAccessCode';
import ReservationControls from '../../../shared/reservation-controls/ReservationControlsContainer';
import TimeRange from '../../../shared/time-range/TimeRange';
import injectT from '../../../i18n/injectT';
import { getMainImage } from '../../../utils/imageUtils';
import { getResourcePageUrl, hasProducts } from '../../../utils/resourceUtils';
import { getReservationPrice, getTaxPercentage } from '../../../../src/domain/resource/utils';
import ResourceHydrator from './ResourceHydrator';

class ReservationListItem extends Component {
  localize(translationObject) {
    return dataUtils.getLocalizedFieldValue(translationObject, this.props.locale, true);
  }

  renderImage(image) {
    if (image && image.url) {
      return <img alt={this.localize(image.caption)} className="resourceImg" src={`${image.url}?dim=700x420`} />;
    }
    return null;
  }

  render() {
    const {
      isAdmin, isStaff, reservation, t,
    } = this.props;
    const resource = reservation.resource;
    const unit = reservation.resource.unit;

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ', ';

    const price = getReservationPrice(reservation.begin, reservation.end, resource);
    const vat = getTaxPercentage(resource);
    const tVariables = {
      price,
      vat,
    };

    const paymentLabel = constants.RESERVATION_PAYMENT_LABELS[reservation.state];
    const statusLabel = constants.RESERVATION_STATE_LABELS[reservation.state];

    return (
      <ResourceHydrator id={reservation.resource.id}>
        {hydratedResource => (
          <li className="reservation">
            <div className="col-md-3 col-lg-2 image-container">
              {hydratedResource.data !== null && (
                <Link
                  aria-hidden="true"
                  tabIndex="-1"
                  to={getResourcePageUrl(hydratedResource.data)}
                >
                  {this.renderImage(getMainImage(hydratedResource.data.images))}
                </Link>
              )}
            </div>
            <div className="col-xs-8 col-md-6 col-lg-7 reservation-details">
              <div className="reservation-state-label-container">
                {hydratedResource.data !== null && (
                  hasProducts(resource)
                    && !hydratedResource.data.staff_event
                    && price > 0 && (
                      <InfoLabel labelStyle={paymentLabel.labelBsStyle} labelText={t(paymentLabel.labelTextId)} />
                  )
                )}
                <InfoLabel labelStyle={statusLabel.labelBsStyle} labelText={t(statusLabel.labelTextId)} />
              </div>
              <Link to={getResourcePageUrl(resource)}>
                <h4>{this.localize(resource.name)}</h4>
              </Link>
              <div>
                {hydratedResource.data !== null && (
                  <img
                    alt={this.localize(hydratedResource.data.type.name)}
                    className="location"
                    src={iconHome}
                  />
                )}
                <span className="unit-name">{this.localize(unit.name)}</span>
                {nameSeparator}
                <span>{this.localize(unit.street_address)}</span>
              </div>
              <div>
                {hydratedResource.data !== null && (
                  <img
                    alt={this.localize(hydratedResource.data.type.name)}
                    className="timeslot"
                    src={iconCalendar}
                  />
                )}
                <TimeRange begin={reservation.begin} end={reservation.end} />
              </div>
              {hydratedResource.data !== null && (
                <ReservationAccessCode
                  reservation={reservation}
                  resource={hydratedResource.data}
                  text={t('ReservationListItem.accessCodeText')}
                />
              )}
              {hydratedResource.data !== null && (
                hasProducts(hydratedResource.data)
                && !hydratedResource.data.staff_event
                && price > 0 && (
                  <div>
                    <span className="price">{`${t('common.totalPriceLabel')}: `}</span>
                    <span>{t('common.priceWithVAT', tVariables)}</span>
                  </div>
                )
              )}
            </div>
            <div className="col-xs-4 col-md-3 col-lg-3 action-container">
              {hydratedResource.data !== null && (
                <ReservationControls
                  isAdmin={isAdmin}
                  isStaff={isStaff}
                  reservation={reservation}
                  resource={hydratedResource.data}
                />
              )}
            </div>
          </li>
        )}

      </ResourceHydrator>
    );
  }
}

ReservationListItem.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default injectT(ReservationListItem);
