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
      searchMapClick: () => {},
      selectedUnitId: null,
      selectUnit: () => {},
      shouldMapFitBoundaries: true,
      showMap: true,
    };
    return shallow(<MapContainer {...defaults} {...props} />);
  }

  it('renders a Leaflet Map', () => {
    const map = getWrapper().find(Map);
    expect(map).to.have.length(1);
  });

  it('adds showMap classname to wrapper div if showMap prop is passed', () => {
    const wrapper = getWrapper();
    expect(wrapper.prop('className')).to.contain('app-ResourceMap__showMap');
  });

  it('does not add showMap classname to wrapper div if showMap prop is not passed', () => {
    const wrapper = getWrapper({ showMap: false });
    expect(wrapper.prop('className')).to.not.contain('app-ResourceMap__showMap');
  });

  it('Map is centered at default position', () => {
    const defaultPosition = [60.18952, 24.99545];
    const map = getWrapper().find(Map);
    expect(map.prop('center')).to.deep.equal(defaultPosition);
  });

  it('Map gets correct onClick prop', () => {
    const searchMapClick = () => {};
    const map = getWrapper({ searchMapClick }).find(Map);
    expect(map.prop('onClick')).to.equal(searchMapClick);
  });

  it('does not render Marker if no markers', () => {
    const markers = [];
    const element = getWrapper({ markers }).find(Marker);
    expect(element).to.have.length(0);
  });

  it('renders Marker', () => {
    const markers = [{ unitId: '1', longitude: 1, latitude: 1, resourceIds: ['a'] }];
    const element = getWrapper({ markers }).find(Marker);
    expect(element).to.have.length(1);
    expect(element.props()).to.include(markers[0]);
  });

  it('renders Marker many markers', () => {
    const markers = [
      { unitId: '1', longitude: 1, latitude: 1, resourceIds: ['a'] },
      { unitId: '2', longitude: 2, latitude: 2, resourceIds: ['b'] },
      { unitId: '3', longitude: 1.5, latitude: 1.5, resourceIds: ['c', 'd'] },
    ];
    const element = getWrapper({ markers }).find(Marker);
    expect(element).to.have.length(3);
    expect(element.at(0).props()).to.include(markers[0]);
    expect(element.at(1).props()).to.include(markers[1]);
    expect(element.at(2).props()).to.include(markers[2]);
  });

  it('passes highlighted prop to Marker if unit is selected', () => {
    const markers = [
      { unitId: '1', longitude: 1, latitude: 1, resourceIds: ['a'] },
      { unitId: '2', longitude: 2, latitude: 2, resourceIds: ['b'] },
    ];
    const element = getWrapper({ markers, selectedUnitId: '1' }).find(Marker);
    expect(element).to.have.length(2);
    expect(element.at(0).prop('highlighted')).to.be.true;
    expect(element.at(1).prop('highlighted')).to.be.false;
  });

  it('renders Marker', () => {
    const selectUnit = () => {};
    const markers = [{ unitId: '1', longitude: 1, latitude: 1, resourceIds: ['a'] }];
    const element = getWrapper({ markers, selectUnit }).find(Marker);
    expect(element).to.have.length(1);
    expect(element.prop('selectUnit')).to.equal(selectUnit);
  });

  it('does not render an userMarker', () => {
    const element = getWrapper().find(UserMarker);
    expect(element).to.have.length(0);
  });

  describe('with a geolocalized user', () => {
    it('centers the map on users position', () => {
      const position = {
        lat: 61,
        lon: 26,
      };
      const map = getWrapper({ position }).find(Map);
      expect(map.prop('center')).to.deep.equal([61, 26]);
    });

    it('renders an userMarker', () => {
      const position = {
        lat: 61,
        lon: 26,
      };
      const element = getWrapper({ position }).find(UserMarker);
      expect(element).to.have.length(1);
      expect(element.prop('latitude')).to.deep.equal(position.lat);
      expect(element.prop('longitude')).to.deep.equal(position.lon);
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
    function callComponentDidUpdate(
        prevBoundaries,
        boundaries,
        fitBounds,
        panTo,
        shouldMapFitBoundaries = true
      ) {
      const instance = getWrapper({ boundaries, shouldMapFitBoundaries: true }).instance();
      instance.map = { leafletElement: { fitBounds, panTo } };
      instance.componentDidUpdate({ boundaries: prevBoundaries, shouldMapFitBoundaries });
    }

    it('calls fitBounds if boundaries changed', () => {
      const prev = { maxLatitude: 0, minLatitude: 0, maxLongitude: 0, minLongitude: 0 };
      const next = { maxLatitude: 1, minLatitude: 0, maxLongitude: 0, minLongitude: 0 };
      const fitBounds = simple.mock();
      const panTo = simple.mock();
      callComponentDidUpdate(prev, next, fitBounds, panTo);
      expect(fitBounds.callCount).to.equal(1);
      expect(fitBounds.lastCall.args).to.deep.equal([
        [[0, 0], [1, 0]],
      ]);
      expect(panTo.called).to.be.false;
    });

    it('does not call fitBounds if boundaries did not change', () => {
      const prev = { maxLatitude: 1, minLatitude: 1, maxLongitude: 1, minLongitude: 1 };
      const fitBounds = simple.mock();
      const panTo = simple.mock();
      callComponentDidUpdate(prev, prev, fitBounds, panTo);
      expect(fitBounds.called).to.be.false;
      expect(panTo.called).to.be.false;
    });

    it('does call panTo if new boundaries are nulls', () => {
      const prev = { maxLatitude: 0, minLatitude: 0, maxLongitude: 0, minLongitude: 0 };
      const next = { maxLatitude: null, minLatitude: null, maxLongitude: null, minLongitude: null };
      const fitBounds = simple.mock();
      const panTo = simple.mock();
      callComponentDidUpdate(prev, next, fitBounds, panTo);
      expect(fitBounds.called).to.be.false;
      expect(panTo.called).to.be.true;
    });
  });
});
