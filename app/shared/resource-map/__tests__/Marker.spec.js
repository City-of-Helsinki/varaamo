import { shallow } from 'enzyme';
import React from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import simple from 'simple-mock';

import Marker from '../Marker';

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

    beforeAll(() => {
      selectUnitMock = simple.mock();
    });

    afterAll(() => {
      simple.restore();
    });

    test('selects unit id', () => {
      getWrapper({ selectUnit: selectUnitMock }).instance().handleClick();
      const actualId = selectUnitMock.lastCall.args[0];
      const expectedId = 'unitid';

      expect(selectUnitMock.callCount).toBe(1);
      expect(actualId).toBe(expectedId);
    });
  });

  describe('render', () => {
    test('is a marker', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(LeafletMarker)).toBe(true);
    });

    test('contains an icon with the number of resources', () => {
      const iconhtml = getWrapper().prop('icon').options.html;
      expect(iconhtml).toContain('<div>2</div>');
    });

    test('icon does not contain a number if only one resource', () => {
      const iconhtml = getWrapper({ resourceIds: ['123'] }).prop('icon').options.html;
      expect(iconhtml).toContain('<div></div>');
    });

    test('has onClick event handlers', () => {
      const marker = getWrapper();
      const instance = marker.instance();
      expect(marker.prop('onClick')).toBe(instance.handleClick);
    });

    test('are rendered at correct positions', () => {
      const marker = getWrapper();
      expect(marker).toHaveLength(1);
      expect(marker.prop('position')).toEqual([1, 2]);
    });
  });
});
