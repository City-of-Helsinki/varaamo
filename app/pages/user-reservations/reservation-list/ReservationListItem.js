import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import ReservationAccessCode from 'shared/reservation-access-code';
import ReservationControls from 'shared/reservation-controls';
import ReservationStateLabel from 'shared/reservation-state-label';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';

class ReservationListItem extends Component {
  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=200x200`;
      return <img alt={image.caption} src={src} />;
    }
    return null;
  }

  render() {
    const {
      isAdmin,
      isStaff,
      reservation,
      resource,
      t,
      unit,
    } = this.props;

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ',';

    return (
      <li className="reservation">
        <div className="image-container">
          <ReservationStateLabel reservation={reservation} />
          <Link to={getResourcePageUrl(resource)}>
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </div>
        <div className="names">
          <Link to={getResourcePageUrl(resource)}>
            <h4>
              {resource.name}{nameSeparator} <span className="unit-name">{unit.name}</span>
            </h4>
          </Link>
        </div>
        <div className="time">
          <Link to={getResourcePageUrl(resource, reservation.begin, reservation.begin)}>
            <TimeRange begin={reservation.begin} end={reservation.end} />
          </Link>
        </div>
        <ReservationAccessCode
          reservation={reservation}
          text={t('ReservationListItem.accessCodeText')}
        />
        <ReservationControls
          isAdmin={isAdmin}
          isStaff={isStaff}
          reservation={reservation}
          resource={resource}
        />
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
