import upperFirst from 'lodash/upperFirst';
import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import FavoriteButton from 'shared/favorite-button';
import Label from 'shared/label';
import { getHourlyPrice } from 'utils/resourceUtils';
import ImageCarousel from './ImageCarousel';

function getAddress({ addressZip, municipality, name, streetAddress }) {
  const parts = [
    name,
    streetAddress,
    `${addressZip} ${upperFirst(municipality)}`.trim(),
  ];
  return parts.filter(part => part).join(', ');
}

function renderEquipment(equipment, t) {
  return equipment.length ?
    <div className="details-row resource-equipment">
      <div className="details-label">{t('ResourceInfo.equipmentHeader')}</div>
      {
        equipment.map(item =>
          <Label bsStyle="primary" key={`label-${item.id}`}>{item.name}</Label>
        )
      }
    </div> :
    null;
}

function ResourceInfo({ isAdmin, resource, unit, t }) {
  return (
    <section className="app-ResourceInfo">
      <div className="app-ResourceInfo__images-wrapper">
        <ImageCarousel images={resource.images || []} />
        <div className="app-ResourceInfo__top-bar">
          <h3>{resource.name} {isAdmin && <FavoriteButton resource={resource} />}</h3>
          <p className="app-ResourceInfo__address">{getAddress(unit)}</p>
        </div>
        <div className="app-ResourceInfo__bottom-bar">
          <span className="app-ResourceInfo__hourly-price">
            {getHourlyPrice(t, resource)}
          </span>
          <Label
            className="app-ResourceInfo__peopleCapacity app-ResourceInfo__label"
            shape="circle"
            size="medium"
            theme="orange"
          >
            {resource.peopleCapacity} <FontAwesome name="users" />
          </Label>
          <Label
            className="app-ResourceInfo__type app-ResourceInfo__label"
            shape="rounded"
            size="medium"
            theme="blue"
          >
            <FontAwesome name="bullseye" /> {resource.type.name}
          </Label>
        </div>
      </div>
      <div className="app-ResourceInfo__description">
        {resource.description && <WrappedText text={resource.description} />}
      </div>
      {renderEquipment(resource.equipment, t)}
    </section>
  );
}

ResourceInfo.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceInfo = injectT(ResourceInfo);  // eslint-disable-line

export default ResourceInfo;
