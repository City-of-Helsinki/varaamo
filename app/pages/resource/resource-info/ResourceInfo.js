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
    <div className="app-ResourceInfo__equipment">
      <h5 className="app-ResourceInfo__equipment-header">{t('ResourceInfo.equipmentHeader')}</h5>
      <table>
        {equipment.map(item =>
          <tr key={`equipment-row-${item.id}`}>
            <td>
              <Label
                className="app-ResourceInfo__equipment-label"
                size="small"
                theme="gold"
              >
                {item.name}
              </Label>
            </td>
            <td>{item.description}</td>
          </tr>
        )}
      </table>
    </div> :
    null;
}

function orderImages(images) {
  return [].concat(
    images.filter(image => image.type === 'main'),
    images.filter(image => image.type !== 'main'),
  );
}

function ResourceInfo({ isAdmin, resource, unit, t }) {
  return (
    <section className="app-ResourceInfo">
      <div className="app-ResourceInfo__images-wrapper">
        <ImageCarousel images={orderImages(resource.images) || []} />
        <div className="app-ResourceInfo__top-bar">
          <h3>{resource.name} {isAdmin && <FavoriteButton resource={resource} />}</h3>
          <p className="app-ResourceInfo__address">{getAddress(unit)}</p>
        </div>
        <div className="app-ResourceInfo__bottom-bar">
          <div className="app-ResourceInfo__hourly-price">
            {getHourlyPrice(t, resource)}
          </div>
          <div className="app-ResourceInfo__labels">
            <Label
              className="app-ResourceInfo__peopleCapacity app-ResourceInfo__label"
              shape="rounded"
              size="medium"
              theme="orange"
            >
              <FontAwesome name="users" /> {resource.peopleCapacity}
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
      </div>
      <div className="app-ResourceInfo__content">
        <div className="app-ResourceInfo__description">
          {resource.description && <WrappedText text={resource.description} />}
        </div>
        {renderEquipment(resource.equipment, t)}
      </div>
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
