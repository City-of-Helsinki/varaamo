import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceEquipment from '../ResourceEquipment';

test('pages/resource/resource-equipment/ResourceEquipment', () => {
  const props = {
    equipment: [
      {
        name: 'Karaoke',
      },
      {
        name: 'Projector',
      },
      {
        name: 'Printer',
      },
    ],
  };

  const wrapper = shallowWithIntl(<ResourceEquipment {...props} />);

  expect(toJSON(wrapper)).toMatchSnapshot();
});
