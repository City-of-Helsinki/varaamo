import upperFirst from 'lodash/upperFirst';
import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import Row from 'react-bootstrap/lib/Row';

import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import FavoriteButton from 'shared/favorite-button';
import ResourceIcons from 'shared/resource-icons';
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
    <section className="resource-info">
      <Row>
        <Col className="resource-images" sm={7} xs={12}>
          <ImageCarousel images={resource.images || []} />
        </Col>
        <Col sm={5} xs={12}>
          {isAdmin && <FavoriteButton resource={resource} />}
          <h1>{resource.name}</h1>
          <p className="address lead">{getAddress(unit)}</p>
          <ResourceIcons resource={resource} />
          {renderEquipment(resource.equipment, t)}
          {resource.description &&
            <div className="resource-description">
              <WrappedText text={resource.description} />
            </div>
          }
        </Col>
      </Row>
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
