import classnames from 'classnames';
import round from 'lodash/round';
import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import { injectT } from 'i18n';
import BackgroundImage from 'shared/background-image';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl, getHourlyPrice } from 'utils/resourceUtils';
import Label from 'shared/label';
import ResourceAvailability from './ResourceAvailability';

class ResourceCard extends Component {
  renderEquipment(equipment) {
    return (
      <Label key={equipment.id} shape="rounded" size="mini" theme="gold">
        {equipment.name}
      </Label>
    );
  }

  renderDistance(distance) {
    const km = distance / 1000;
    let formatedDistance = round(km);
    if (km < 10) {
      formatedDistance = round(km, 1);
    }
    return `${formatedDistance} km`;
  }

  render() {
    const { date, resource, t, unit } = this.props;

    return (
      <div
        className={classnames(
          'app-ResourceCard',
          { 'app-ResourceCard__stacked': this.props.stacked },
        )}
      >
        <Link className="app-ResourceCard__image-link" to={getResourcePageUrl(resource, date)}>
          <BackgroundImage
            height={420}
            image={getMainImage(resource.images)}
            width={700}
          >
            {resource.distance &&
              <Label
                className="app-ResourceCard__distance"
                shape="circle"
                size="medium"
                theme="copper"
              >
                {this.renderDistance(resource.distance)}
              </Label>
            }
            <Label
              className="app-ResourceCard__peopleCapacity"
              shape="circle"
              size="medium"
              theme="orange"
            >
              {resource.peopleCapacity}
              <FontAwesome name="users" />
            </Label>
            <span className="app-ResourceCard__hourly-price">
              {getHourlyPrice(t, resource)}
            </span>
          </BackgroundImage>
        </Link>
        <div className="app-ResourceCard__content">
          <Link to={getResourcePageUrl(resource, date)}>
            <h4>{resource.name}</h4>
          </Link>
          <div className="app-ResourceCard__unit-name">
            <span>{unit.name}</span>
            {resource.type && <Label size="mini" theme="blue">{resource.type.name}</Label>}
          </div>
          <div className="app-ResourceCard__street-address">
            <span>{`${unit.streetAddress}, ${unit.addressZip} `}</span>
            <span>{unit.municipality}</span>
          </div>
          <div className="app-ResourceCard__equipment">
            {resource.equipment && resource.equipment.map(this.renderEquipment)}
          </div>
          <ResourceAvailability date={date} resource={resource} />
        </div>
      </div>
    );
  }
}

ResourceCard.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  stacked: PropTypes.bool,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

export default injectT(ResourceCard);
