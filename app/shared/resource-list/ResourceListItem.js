import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import { injectT } from 'i18n';
import BackgroundImage from 'shared/background-image';
import { getMainImage } from 'utils/imageUtils';
import { getResourcePageUrl, getHourlyPrice } from 'utils/resourceUtils';
import Label from 'shared/label';
import ResourceAvailability from './ResourceAvailability';

class ResourceListItem extends Component {
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
      <li className="app-ResourceListItem">
        <Link className="app-ResourceListItem__image-link" to={getResourcePageUrl(resource, date)}>
          <BackgroundImage
            height={420}
            image={getMainImage(resource.images)}
            width={700}
          >
            <Label
              className="app-ResourceListItem__peopleCapacity"
              shape="circle"
              size="medium"
              theme="orange"
            >
              {resource.peopleCapacity}
              <FontAwesome name="users" />
            </Label>
            <span className="app-ResourceListItem__hourly-price">
              {getHourlyPrice(t, resource)}
            </span>
          </BackgroundImage>
        </Link>
        <div className="app-ResourceListItem__content">
          <Link to={getResourcePageUrl(resource, date)}>
            <h4>{resource.name}</h4>
          </Link>
          <div className="app-ResourceListItem__unit-name">
            <span>{unit.name}</span>
            {resource.type && <Label size="mini" theme="blue">{resource.type.name}</Label>}
          </div>
          <div className="app-ResourceListItem__equipment">
            {resource.equipment.map(this.renderEquipment)}
          </div>
          <ResourceAvailability date={date} resource={resource} />
        </div>
      </li>
    );
  }
}

ResourceListItem.propTypes = {
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

ResourceListItem.contextTypes = {
  location: React.PropTypes.object,
};

export default injectT(ResourceListItem);
