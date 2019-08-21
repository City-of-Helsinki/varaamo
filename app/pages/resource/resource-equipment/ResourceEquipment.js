import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import injectT from '../../../i18n/injectT';

function ResourceEquipment({
  equipment = [],
  t,
}) {
  const equipmentColumns = equipment.map(
    (item, i) => <Col key={i} lg={3} md={3} xs={6}>{item.name}</Col>
  );
  return (
    <Panel defaultExpanded>
      <Panel.Heading>
        <Panel.Title componentClass="h3" toggle>{t('ResourceEquipment.headingText')}</Panel.Title>
      </Panel.Heading>
      <Panel.Collapse>
        <Panel.Body>
          <Row>
            {equipmentColumns}
          </Row>
        </Panel.Body>
      </Panel.Collapse>
    </Panel>
  );
}

ResourceEquipment.propTypes = {
  equipment: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceEquipment);
