import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import iconHome from 'hel-icons/dist/shapes/home.svg';

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

class ReservationListItem extends Component {
  renderImage(image) {
    if (image && image.url) {
      return <img alt={image.caption} className="resourceImg" src={image.url} />;
    }
    return null;
  }

  render() {
    const {
      isAdmin, isStaff, reservation, resource, t, unit,
    } = this.props;

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
      <li className="reservation">
        <div className="col-md-3 col-lg-2 image-container">
          <Link to={getResourcePageUrl(resource)}>
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </div>
        <div className="col-xs-8 col-md-6 col-lg-7 reservation-details">
          <div className="reservation-state-label-container">
            {hasProducts(resource)
              && !reservation.staffEvent
              && price > 0 && (
                <InfoLabel labelStyle={paymentLabel.labelBsStyle} labelText={t(paymentLabel.labelTextId)} />
            )}
            <InfoLabel labelStyle={statusLabel.labelBsStyle} labelText={t(statusLabel.labelTextId)} />
          </div>
          <Link to={getResourcePageUrl(resource)}>
            <h4>{resource.name}</h4>
          </Link>
          <div>
            <img alt={resource.type.name} className="location" src={iconHome} />
            <span className="unit-name">{unit.name}</span>
            {nameSeparator}
            <span>{unit.streetAddress}</span>
          </div>
          <div>
            <img alt={resource.type.name} className="timeslot" src={iconCalendar} />
            <TimeRange begin={reservation.begin} end={reservation.end} />
          </div>
          <ReservationAccessCode
            reservation={reservation}
            resource={resource}
            text={t('ReservationListItem.accessCodeText')}
          />
          {hasProducts(resource)
            && !reservation.staffEvent
            && price > 0 && (
            <div>
              <span className="price">{`${t('common.totalPriceLabel')}: `}</span>
              <span>{t('common.priceWithVAT', tVariables)}</span>
            </div>
          )}
        </div>
        <div className="col-xs-4 col-md-3 col-lg-3 action-container">
          <ReservationControls
            isAdmin={isAdmin}
            isStaff={isStaff}
            reservation={reservation}
            resource={resource}
          />
        </div>
      </li>
    );
  }
}

ReservationListItem.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectT(ReservationListItem);
