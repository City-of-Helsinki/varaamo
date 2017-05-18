import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import Marker from './Marker';

function getWrapper(props) {
  const defaults = {
    latitude: 1,
    longitude: 2,
    resourceId: '123',
  };
  return shallow(<Marker {...defaults} {...props} />);
}

describe('shared/resource-map/Marker', () => {
  describe('handleClick', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    after(() => {
      simple.restore();
    });

    it('redirects to resource page', () => {
      getWrapper().instance().handleClick();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = '/resources/123';

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });

  describe('render', () => {
    it('is a marker', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(LeafletMarker)).to.be.true;
    });

    it('has onClick event handlers', () => {
      const marker = getWrapper();
      const instance = marker.instance();
      expect(marker.prop('onClick')).to.equal(instance.handleClick);
    });

    it('are rendered at correct positions', () => {
      const marker = getWrapper();
      expect(marker).to.have.length(1);
      expect(marker.prop('position')).to.deep.equal([1, 2]);
    });
  });
});
