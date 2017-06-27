import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import simple from 'simple-mock';

import Marker from './Marker';

function getWrapper(props) {
  const defaults = {
    latitude: 1,
    longitude: 2,
    resourceIds: ['123', '321'],
    selectUnit: () => {},
    unitId: 'unitid',
  };
  return shallow(<Marker {...defaults} {...props} />);
}

describe('shared/resource-map/Marker', () => {
  describe('handleClick', () => {
    let selectUnitMock;

    before(() => {
      selectUnitMock = simple.mock();
    });

    after(() => {
      simple.restore();
    });

    it('selects unit id', () => {
      getWrapper({ selectUnit: selectUnitMock }).instance().handleClick();
      const actualId = selectUnitMock.lastCall.args[0];
      const expectedId = 'unitid';

      expect(selectUnitMock.callCount).to.equal(1);
      expect(actualId).to.equal(expectedId);
    });
  });

  describe('render', () => {
    it('is a marker', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(LeafletMarker)).to.be.true;
    });

    it('contains an icon with the number of resources', () => {
      const iconhtml = getWrapper().prop('icon').options.html;
      expect(iconhtml).to.contain('<div>2</div>');
    });

    it('icon does not contain a number if only one resource', () => {
      const iconhtml = getWrapper({ resourceIds: ['123'] }).prop('icon').options.html;
      expect(iconhtml).to.contain('<div></div>');
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
