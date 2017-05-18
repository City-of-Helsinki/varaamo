import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Marker } from 'react-leaflet';

import UserMarker from './UserMarker';

function getWrapper(props) {
  const defaults = {
    latitude: 1,
    longitude: 2,
  };
  return shallow(<UserMarker {...defaults} {...props} />);
}

describe('shared/resource-map/UserMarker', () => {
  describe('render', () => {
    it('is a marker', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(Marker)).to.be.true;
    });

    it('is rendered at correct positions', () => {
      const marker = getWrapper();
      expect(marker).to.have.length(1);
      expect(marker.prop('position')).to.deep.equal([1, 2]);
    });
  });
});
