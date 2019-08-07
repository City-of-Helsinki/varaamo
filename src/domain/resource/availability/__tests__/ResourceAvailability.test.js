import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import ResourceAvailability from '../ResourceAvailability';
import resource from '../../../../common/data/fixtures/resource';

describe('ResourceAvailability', () => {
  test('renders correctly', () => {
    const props = {
      date: '2019-07-30',
      resource: resource.build(),
    };
    const wrapper = shallowWithIntl(
      <ResourceAvailability {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
