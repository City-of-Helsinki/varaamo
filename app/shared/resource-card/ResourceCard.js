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
  render() {
    const { resource, t, unit } = this.props;
    const date = this.context.location.query.date;

    return (
      <li className="app-ResourceCard">
        <Link className="app-ResourceCard__image-link" to={getResourcePageUrl(resource, date)}>
          <BackgroundImage
            height={420}
            image={getMainImage(resource.images)}
            width={700}
          >
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
          <div className="app-ResourceCard__equipment">
            {resource.equipment.map(this.renderEquipment)}
          </div>
          <ResourceAvailability date={date} resource={resource} />
        </div>
      </li>
    );
  }
}

ResourceCard.propTypes = {
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

ResourceCard.contextTypes = {
  location: React.PropTypes.object,
};

export default injectT(ResourceCard);
