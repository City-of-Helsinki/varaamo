import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import TimeRange from 'shared/time-range';
import ReservationAccessCode from 'shared/reservation-access-code';
import ReservationControls from 'shared/reservation-controls';
import ReservationStateLabel from 'shared/reservation-state-label';
import { getCaption, getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { getName } from 'utils/translationUtils';

class ReservationListItem extends Component {
  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=200x200`;
      return <img alt={getCaption(image)} src={src} />;
    }
    return null;
  }

  render() {
    const {
      isAdmin,
      isStaff,
      reservation,
      resource,
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
              {getName(resource)}{nameSeparator} <span className="unit-name">{getName(unit)}</span>
            </h4>
          </Link>
        </div>
        <div className="time">
          <Link to={getResourcePageUrl(resource, reservation.begin, reservation.begin)}>
            <TimeRange
              begin={reservation.begin}
              className="hidden-xs"
              end={reservation.end}
            />
            <TimeRange
              begin={reservation.begin}
              className="visible-xs-block"
              dateFormat="dd, D.M."
              end={reservation.end}
            />
          </Link>
        </div>
        <ReservationAccessCode reservation={reservation} text="Tilan PIN-koodi:" />
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
  unit: PropTypes.object.isRequired,
};

export default ReservationListItem;
