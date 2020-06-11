import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import injectT from '../../../i18n/injectT';
import ResourcePanel from '../resource-info/ResourcePanel';

function ResourceEquipment({ equipment = [], t }) {
  const equipmentColumns = equipment.map((item, i) => (
    <Col key={i} lg={3} md={3} xs={6}>
      {item.name}
    </Col>
  ));
  return (
    <ResourcePanel header={t('ResourceEquipment.headingText')}>
      <Row>{equipmentColumns}</Row>
    </ResourcePanel>
  );
}

ResourceEquipment.propTypes = {
  equipment: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceEquipment);
