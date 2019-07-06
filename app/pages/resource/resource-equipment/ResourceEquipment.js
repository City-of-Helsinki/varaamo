import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

function ResourceEquipment({
  equipment = []
}) {
  console.log(equipment);
  const equipmentColumns = equipment.map(
    (item, i) => <Col key={i} lg={3} md={3} xs={6}>{item.name}</Col>
  );
  return (
    <Panel>
      <h3>Equipment</h3>
      <Row>
        {equipmentColumns}
      </Row>
    </Panel>
  );
}

ResourceEquipment.propTypes = {
  equipment: PropTypes.array.isRequired
};

export default ResourceEquipment;
