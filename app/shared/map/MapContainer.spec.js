import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Map } from 'react-leaflet';
import simple from 'simple-mock';

import { UnconnectedMapContainer as MapContainer } from './MapContainer';
import Markers from './Markers';

describe('screens/map/MapContainer', () => {
  function getWrapper(props) {
    const defaults = {
      isLoaded: true,
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

  it('renders map even if not loaded', () => {
    const map = getWrapper({ isLoaded: false }).find(Map);
    expect(map).to.have.length(1);
  });

  it('renders a Leaflet Map', () => {
    const map = getWrapper().find(Map);
    expect(map).to.have.length(1);
  });

  it('renders Markers', () => {
    const markers = [{ id: '1', longitude: 1, latitude: 1, owner: 'A' }];
    const element = getWrapper({ markers }).find(Markers);
    expect(element).to.have.length(1);
    expect(element.prop('markers')).to.equal(markers);
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

    it('does not call fitBounds if not loaded', () => {
      const fitBounds = simple.mock();
      callOnMapRef(fitBounds, {
        maxLatitude: 10,
        minLatitude: 5,
        maxLongitude: 20,
        minLongitude: 15,
      }, { isLoaded: false });
      expect(fitBounds.called).to.be.false;
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
