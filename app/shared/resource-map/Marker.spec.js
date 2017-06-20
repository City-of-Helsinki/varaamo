import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Marker as LeafletMarker, Tooltip } from 'react-leaflet';
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

    it('contains a tooltip with the number of resources', () => {
      const wrapper = getWrapper().find(Tooltip);
      expect(wrapper).to.have.length(1);
      expect(wrapper.children().text()).to.be.equal('2');
    });

    it('does not contains a tooltip with the number of resources if only one resource', () => {
      const wrapper = getWrapper({ resourceIds: ['123'] }).find(Tooltip);
      expect(wrapper).to.have.length(0);
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
