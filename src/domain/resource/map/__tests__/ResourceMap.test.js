import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ResourceMap from '../ResourceMap';
import Unit from '../../../../../app/utils/fixtures/Unit';
import Resource from '../../../../../app/utils/fixtures/Resource';


describe('ResourceMap', () => {
  test('renders correctly', () => {
    const props = {
      unit: Unit.build({
        location: {
          coordinates: [
            24.975634,
            60.20843
          ]
        }
      }),
      resource: Resource.build()
    };
    const wrapper = shallow(
      <ResourceMap {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
