import { expect } from 'chai';

import selector from './mapSelector';

function getState({ units = {}, city = '', postalCodes = [], owners = [] }) {
  return { data: { units }, filters: { city, postalCodes, owners } };
}

function createUnit(id, latitude, longitude, { city = 'Helsinki', addressZip = '00100', owner = 'Owner' } = {}) {
  return Object.assign(
    { id, coordinates: { latitude, longitude } },
    { city, addressZip, owner }
  );
}

const padding = 0.004;

describe('screens/map/mapSelector', () => {
  describe('markers', () => {
    it('are returned', () => {
      const data = selector(getState({
        units: {
          21: createUnit(21, 0, 1),
          1: createUnit(1, 2, 3),
        },
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 2, longitude: 3, owner: 'Owner' },
        { id: '21', latitude: 0, longitude: 1, owner: 'Owner' },
      ]);
    });

    it('include owner', () => {
      const data = selector(getState({
        units: {
          1: createUnit(1, 0, 0, { owner: 'AVAIN Asumisoikeus Oy' }),
          2: createUnit(2, 0, 0, { owner: 'Asumisoikeusyhdistys Suomen Omakoti' }),
          3: createUnit(3, 0, 0, { owner: 'Asuntosäätiön Asumisoikeus Oy' }),
          4: createUnit(4, 0, 0, { owner: 'Helsingin Asumisoikeus Oy' }),
          5: createUnit(5, 0, 0, { owner: 'Helsingin Seudun Asumisoikeusyhdistys HELAS' }),
        },
      }));
      expect(data.markers.map(marker => marker.owner)).to.deep.equal([
        'AVAIN Asumisoikeus Oy',
        'Asumisoikeusyhdistys Suomen Omakoti',
        'Asuntosäätiön Asumisoikeus Oy',
        'Helsingin Asumisoikeus Oy',
        'Helsingin Seudun Asumisoikeusyhdistys HELAS',
      ]);
    });

    it('are filtered by city', () => {
      const data = selector(getState({
        units: {
          21: createUnit(21, 0, 1, { city: 'Helsinki' }),
          1: createUnit(1, 2, 3, { city: 'Espoo' }),
        },
        city: 'Espoo',
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 2, longitude: 3, owner: 'Owner' },
      ]);
    });

    it('are not filtered by city if city filter is ""', () => {
      const data = selector(getState({
        units: {
          21: createUnit(21, 0, 1, { city: 'Helsinki' }),
          1: createUnit(1, 2, 3, { city: 'Espoo' }),
        },
        city: '',
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 2, longitude: 3, owner: 'Owner' },
        { id: '21', latitude: 0, longitude: 1, owner: 'Owner' },
      ]);
    });

    it('are filtered by postal code', () => {
      const data = selector(getState({
        units: {
          21: createUnit(21, 0, 1, { addressZip: '00100' }),
          1: createUnit(1, 2, 3, { addressZip: '00200' }),
          3: createUnit(3, 2, 3, { addressZip: '00300' }),
        },
        postalCodes: ['00200', '00300'],
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 2, longitude: 3, owner: 'Owner' },
        { id: '3', latitude: 2, longitude: 3, owner: 'Owner' },
      ]);
    });

    it('are not filtered by postal code if postalCodes is []', () => {
      const data = selector(getState({
        units: {
          21: createUnit(21, 0, 1, { addressZip: '00100' }),
          1: createUnit(1, 2, 3, { addressZip: '00200' }),
          3: createUnit(3, 2, 3, { addressZip: '00300' }),
        },
        postalCodes: [],
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 2, longitude: 3, owner: 'Owner' },
        { id: '21', latitude: 0, longitude: 1, owner: 'Owner' },
        { id: '3', latitude: 2, longitude: 3, owner: 'Owner' },
      ]);
    });

    it('are filtered by postal code and city', () => {
      const data = selector(getState({
        units: {
          21: createUnit(21, 0, 1, { city: 'Helsinki', addressZip: '00100' }),
          1: createUnit(1, 2, 3, { city: 'Espoo', addressZip: '02100' }),
          3: createUnit(3, 2, 3, { city: 'Espoo', addressZip: '02200' }),
        },
        city: 'Espoo',
        postalCodes: ['02100', '00100'],
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 2, longitude: 3, owner: 'Owner' },
      ]);
    });

    it('are filtered by owner', () => {
      const data = selector(getState({
        units: {
          1: createUnit(1, 0, 1, { owner: 'Owner A' }),
          2: createUnit(2, 0, 1, { owner: 'Owner B' }),
          3: createUnit(3, 0, 1, { owner: 'Owner C' }),
        },
        owners: ['Owner A', 'Owner C'],
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 0, longitude: 1, owner: 'Owner A' },
        { id: '3', latitude: 0, longitude: 1, owner: 'Owner C' },
      ]);
    });

    it('are not filtered by owner if owner is []', () => {
      const data = selector(getState({
        units: {
          1: createUnit(1, 0, 1, { owner: 'Owner A' }),
          2: createUnit(2, 0, 1, { owner: 'Owner B' }),
          3: createUnit(3, 0, 1, { owner: 'Owner C' }),
        },
        owners: [],
      }));
      expect(data.markers).to.deep.equal([
        { id: '1', latitude: 0, longitude: 1, owner: 'Owner A' },
        { id: '2', latitude: 0, longitude: 1, owner: 'Owner B' },
        { id: '3', latitude: 0, longitude: 1, owner: 'Owner C' },
      ]);
    });
  });

  it('returns boundaries', () => {
    const data = selector(getState({
      units: {
        1: createUnit(1, 5, 5),
        2: createUnit(2, 0, 10),
        3: createUnit(3, 3, 3),
        4: createUnit(4, 5, 8),
      },
    }));
    expect(data.boundaries).to.deep.equal({
      maxLatitude: 5 + padding,
      minLatitude: 0 - padding,
      maxLongitude: 10 + padding,
      minLongitude: 3 - padding,
    });
  });

  describe('isLoaded', () => {
    it('is true if has units', () => {
      const data = selector(getState({ units: { 1: createUnit(1, 1, 1) } }));
      expect(data.isLoaded).to.be.true;
    });

    it('is false if no units', () => {
      const data = selector(getState({ units: {} }));
      expect(data.isLoaded).to.be.false;
    });

    it('is true if has units but none match filters', () => {
      const data = selector(getState({
        units: { 1: createUnit(1, 5, 5, { city: 'Helsinki' }) },
        city: 'Espoo',
      }));
      expect(data.isLoaded).to.be.true;
    });
  });
});
