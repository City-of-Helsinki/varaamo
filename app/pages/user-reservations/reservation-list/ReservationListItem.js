import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import TimeRange from 'shared/time-range';
import ReservationControls from 'shared/reservation-controls';
import { getCaption, getMainImage } from 'utils/imageUtils';
import { renderReservationStateLabel } from 'utils/renderUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { getName } from 'utils/translationUtils';

class ReservationListItem extends Component {
  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=100x120`;
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
        <div className="image">
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
              end={reservation.end}
              className="hidden-xs"
            />
            <TimeRange
              begin={reservation.begin}
              dateFormat="dd, D.M."
              end={reservation.end}
              className="visible-xs-block"
            />
          </Link>
        </div>
        {renderReservationStateLabel(reservation)}
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
