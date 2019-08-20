import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceEquipment from '../ResourceEquipment';

describe('pages/resource/resource-equipment/ResourceEquipment', () => {
  const defaultProps = {
    equipment: [
      {
        name: 'Karaoke'
      },
      {
        name: 'Projector'
      },
      {
        name: 'Printer'
      }
    ],
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceEquipment {...defaultProps} {...props} />);
  }
  test('renders panel and equipment heading correctly', () => {
    const panels = getWrapper().find(Panel);

    expect(panels).toHaveLength(1);
  });

  test('renders equipment content correctly', () => {
    const equipmentRow = getWrapper().find(Row);
    const equipmentCol = getWrapper().find(Col);
    expect(equipmentRow).toHaveLength(1);
    expect(equipmentCol).toHaveLength(3);
  });

  test('check component props and types correctly', () => {
    expect(defaultProps).toHaveProperty('equipment');
    expect(defaultProps.equipment).toHaveLength(3);
    expect(defaultProps.equipment).toBeInstanceOf(Array);
  });
});
