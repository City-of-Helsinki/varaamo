import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import iconHome from 'hel-icons/dist/shapes/home.svg';

import iconCalendar from 'assets/icons/calendar.svg';
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
      return <img alt={image.caption} className="resourceImg" src={image.url} />;
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

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ', ';

    return (
      <li className="reservation">
        <div className="col-md-3 col-lg-2 image-container">
          <Link to={getResourcePageUrl(resource)}>
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </div>
        <div className="col-xs-8 col-md-6 col-lg-7 reservation-details">
          <ReservationStateLabel reservation={reservation} />
          <Link to={getResourcePageUrl(resource)}>
            <h4>
              {resource.name}
            </h4>
          </Link>
          <div>
            <img alt={resource.type.name} className="location" src={iconHome} />
            <span className="unit-name">{unit.name}</span>{nameSeparator}<span>{unit.streetAddress}</span>
          </div>
          <div>
            <img alt={resource.type.name} className="timeslot" src={iconCalendar} />
            <TimeRange begin={reservation.begin} end={reservation.end} />
          </div>
          <ReservationAccessCode
            reservation={reservation}
            text={t('ReservationListItem.accessCodeText')}
          />
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
