import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ResourceMap from '../ResourceMap';
import resource from '../../../../common/data/fixtures/resource';
import unit from '../../../../common/data/fixtures/unit';

describe('ResourceMap', () => {
  test('renders correctly', () => {
    const props = {
      unit: unit.build({
        location: {
          coordinates: [24.975634, 60.20843],
        },
      }),
      resource: resource.build(),
    };
    const wrapper = shallow(<ResourceMap {...props} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
