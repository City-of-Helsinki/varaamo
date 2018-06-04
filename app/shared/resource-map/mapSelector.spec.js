import { expect } from 'chai';

import selector from './mapSelector';

function getState({
    units = {},
    resources = {},
    filters = { date: '2012-02-02', duration: 30, end: '00:00', page: 1, search: '', start: '08:30' },
  } = {}) {
  return {
    data: { units, resources },
    ui: { search: { filters, position: null } },
  };
}

function getProps(props) {
  return {
    location: { query: {} },
    ...props,
  };
}

function createUnit(id, latitude, longitude) {
  return {
    id,
    location: { coordinates: [longitude, latitude] },
  };
}

function createResource(id, unitId) {
  return {
    id,
    unit: unitId,
  };
}

const padding = 0.004;

describe('shared/resource-map/mapSelector', () => {
  describe('markers', () => {
    it('are returned', () => {
      const state = getState({
        units: {
          21: createUnit('21', 0, 1),
          1: createUnit('1', 2, 3),
        },
        resources: {
          123: createResource('123', 21),
          321: createResource('321', 1),
        },
      });
      const props = getProps({ resourceIds: ['123', '321'] });
      const data = selector(state, props);
      expect(data.markers).to.deep.equal([
        { unitId: 1, latitude: 2, longitude: 3, resourceIds: ['321'] },
        { unitId: 21, latitude: 0, longitude: 1, resourceIds: ['123'] },
      ]);
    });

    it('are grouped by unit if resources in the same unit', () => {
      const state = getState({
        units: {
          21: createUnit('21', 0, 1),
          12: createUnit('12', 1, 2),
          1: createUnit('1', 2, 3),
        },
        resources: {
          123: createResource('123', 21),
          321: createResource('321', 21),
          456: createResource('456', 12),
          789: createResource('789', 12),
        },
      });
      const props = getProps({ resourceIds: ['123', '321', '456'] });
      const data = selector(state, props);
      expect(data.markers).to.deep.equal([
        { unitId: 12, latitude: 1, longitude: 2, resourceIds: ['456'] },
        { unitId: 21, latitude: 0, longitude: 1, resourceIds: ['123', '321'] },
      ]);
    });

    it('are returned if id in resourceIds prop', () => {
      const state = getState({
        units: {
          21: createUnit('21', 0, 1),
          1: createUnit('1', 2, 3),
        },
        resources: {
          123: createResource('123', 21),
          321: createResource('321', 1),
        },
      });
      const props = getProps({ resourceIds: ['123'] });
      const data = selector(state, props);
      expect(data.markers).to.deep.equal([
        { unitId: 21, latitude: 0, longitude: 1, resourceIds: ['123'] },
      ]);
    });

    it('are not returned if unit id not in state', () => {
      const state = getState({
        units: {
          21: createUnit('21', 0, 1),
          1: createUnit('1', 2, 3),
        },
        resources: {
          123: createResource('123', 21),
          321: createResource('321', 31),
        },
      });
      const props = getProps({ resourceIds: ['123', '321'] });
      const data = selector(state, props);
      expect(data.markers).to.deep.equal([
        { unitId: 21, latitude: 0, longitude: 1, resourceIds: ['123'] },
      ]);
    });
  });

  it('returns boundaries', () => {
    const state = getState({
      units: {
        1: createUnit('1', 5, 5),
        2: createUnit('2', 0, 10),
        3: createUnit('3', 3, 3),
        4: createUnit('4', 5, 8),
      },
      resources: {
        1: createResource('1', 1),
        2: createResource('2', 2),
        3: createResource('3', 3),
        4: createResource('4', 4),
      },
    });
    const props = getProps({ resourceIds: ['1', '2', '3', '4'] });
    const data = selector(state, props);
    expect(data.boundaries).to.deep.equal({
      maxLatitude: 5 + padding,
      minLatitude: 0 - padding,
      maxLongitude: 10 + padding,
      minLongitude: 3 - padding,
    });
  });

  describe('shouldMapFitBoundaries', () => {
    it('is false if no filters or selected unit', () => {
      const state = getState();
      const props = getProps({ resourceIds: ['123'] });
      const data = selector(state, props);
      expect(data.shouldMapFitBoundaries).to.equal(false);
    });

    it('is true if filters have some data', () => {
      const state = getState();
      const props = getProps({
        location: {
          query: { date: '2012-02-02', search: 'search' },
        },
        resourceIds: ['123'],
      });
      const data = selector(state, props);
      expect(data.shouldMapFitBoundaries).to.equal(true);
    });

    it('is true if unit is seleted', () => {
      const state = getState();
      const props = getProps({ resourceIds: ['123'], selectedUnitId: '123123' });
      const data = selector(state, props);
      expect(data.shouldMapFitBoundaries).to.equal(true);
    });
  });
});
