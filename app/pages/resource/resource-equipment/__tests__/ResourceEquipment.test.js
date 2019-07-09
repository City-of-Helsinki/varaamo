import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceEquipment from '../ResourceEquipment';

describe('pages/resource/resource-equipment/ResourceEquipment', () => {
  const defaultProps = {
    equipment: [],
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceEquipment {...defaultProps} {...props} />);
  }

  test('renders panel and equipment heading correctly', () => {
    const panels = getWrapper().find(Panel);
    const heading = getWrapper().find('h3');
    const equipmentRow = getWrapper().find(Row);

    expect(panels).toHaveLength(1);
    expect(heading).toHaveLength(1);
    expect(heading.text()).toBe('ResourceEquipment.headingText');
    expect(equipmentRow).toHaveLength(1);
  });
});
