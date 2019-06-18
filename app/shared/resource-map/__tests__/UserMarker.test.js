import { shallow } from 'enzyme';
import React from 'react';
import { Marker } from 'react-leaflet';

import UserMarker from '../UserMarker';

function getWrapper(props) {
  const defaults = {
    latitude: 1,
    longitude: 2,
  };
  return shallow(<UserMarker {...defaults} {...props} />);
}

describe('shared/resource-map/UserMarker', () => {
  describe('render', () => {
    test('is a marker', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(Marker)).toBe(true);
    });

    test('is rendered at correct positions', () => {
      const marker = getWrapper();
      expect(marker).toHaveLength(1);
      expect(marker.prop('position')).toEqual([1, 2]);
    });
  });
});
