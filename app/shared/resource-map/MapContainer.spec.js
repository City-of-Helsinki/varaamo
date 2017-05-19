import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Map } from 'react-leaflet';
import simple from 'simple-mock';

import { UnconnectedResourceMapContainer as MapContainer } from './MapContainer';
import Marker from './Marker';
import UserMarker from './UserMarker';

describe('shared/resource-map/MapContainer', () => {
  function getWrapper(props) {
    const defaults = {
      markers: [],
      boundaries: {
        maxLatitude: 0,
        minLatitude: 0,
        maxLongitude: 0,
        minLongitude: 0,
      },
    };
    return shallow(<MapContainer {...defaults} {...props} />);
  }

  it('renders a Leaflet Map', () => {
    const map = getWrapper().find(Map);
    expect(map).to.have.length(1);
  });

  it('Map is centered at default position', () => {
    const defaultPosition = [60.372465778991284, 24.818115234375004];
    const map = getWrapper().find(Map);
    expect(map.prop('center')).to.deep.equal(defaultPosition);
  });

  it('does not render Marker if no markers', () => {
    const markers = [];
    const element = getWrapper({ markers }).find(Marker);
    expect(element).to.have.length(0);
  });

  it('renders Marker', () => {
    const markers = [{ unitId: 1, longitude: 1, latitude: 1, resourceIds: ['a'] }];
    const element = getWrapper({ markers }).find(Marker);
    expect(element).to.have.length(1);
    expect(element.props()).to.deep.equal(markers[0]);
  });

  it('renders Marker many markers', () => {
    const markers = [
      { unitId: 1, longitude: 1, latitude: 1, resourceIds: ['a'] },
      { unitId: 2, longitude: 2, latitude: 2, resourceIds: ['b'] },
      { unitId: 3, longitude: 1.5, latitude: 1.5, resourceIds: ['c', 'd'] },
    ];
    const element = getWrapper({ markers }).find(Marker);
    expect(element).to.have.length(3);
    expect(element.at(0).props()).to.deep.equal(markers[0]);
    expect(element.at(1).props()).to.deep.equal(markers[1]);
    expect(element.at(2).props()).to.deep.equal(markers[2]);
  });

  it('does not render an userMarker', () => {
    const element = getWrapper().find(UserMarker);
    expect(element).to.have.length(0);
  });

  describe('with a geolocalized user', () => {
    it('centers the map on users position', () => {
      const coords = {
        latitude: 61,
        longitude: 26,
      };
      const map = getWrapper({ coords }).find(Map);
      expect(map.prop('center')).to.deep.equal([61, 26]);
    });

    it('renders an userMarker', () => {
      const coords = {
        latitude: 61,
        longitude: 26,
      };
      const element = getWrapper({ coords }).find(UserMarker);
      expect(element).to.have.length(1);
      expect(element.props()).to.deep.equal(coords);
    });
  });

  describe('onMapRef', () => {
    function callOnMapRef(fitBounds, boundaries, extra = {}) {
      const wrapper = getWrapper(Object.assign(extra, { boundaries }));
      wrapper.instance().onMapRef({ leafletElement: { fitBounds } });
    }

    it('calls fitBounds on Leaflet map', () => {
      const fitBounds = simple.mock();
      callOnMapRef(fitBounds, {
        maxLatitude: 10,
        minLatitude: 5,
        maxLongitude: 20,
        minLongitude: 15,
      });
      expect(fitBounds.callCount).to.equal(1);
      expect(fitBounds.lastCall.args).to.deep.equal([
        [[5, 15], [10, 20]],
      ]);
    });
  });

  describe('componentDidUpdate', () => {
    function callComponentDidUpdate(prevBoundaries, boundaries, fitBounds) {
      const instance = getWrapper({ boundaries }).instance();
      instance.map = { leafletElement: { fitBounds } };
      instance.componentDidUpdate({ boundaries: prevBoundaries });
    }

    it('calls fitBounds if boundaries changed', () => {
      const prev = { maxLatitude: 0, minLatitude: 0, maxLongitude: 0, minLongitude: 0 };
      const next = { maxLatitude: 1, minLatitude: 0, maxLongitude: 0, minLongitude: 0 };
      const fitBounds = simple.mock();
      callComponentDidUpdate(prev, next, fitBounds);
      expect(fitBounds.callCount).to.equal(1);
      expect(fitBounds.lastCall.args).to.deep.equal([
        [[0, 0], [1, 0]],
      ]);
    });

    it('does not call fitBounds if boundaries did not change', () => {
      const prev = { maxLatitude: 1, minLatitude: 1, maxLongitude: 1, minLongitude: 1 };
      const fitBounds = simple.mock();
      callComponentDidUpdate(prev, prev, fitBounds);
      expect(fitBounds.called).to.be.false;
    });

    it('does not call fitBounds if new boundaries are nulls', () => {
      const prev = { maxLatitude: 0, minLatitude: 0, maxLongitude: 0, minLongitude: 0 };
      const next = { maxLatitude: null, minLatitude: null, maxLongitude: null, minLongitude: null };
      const fitBounds = simple.mock();
      callComponentDidUpdate(prev, next, fitBounds);
      expect(fitBounds.called).to.be.false;
    });
  });
});
