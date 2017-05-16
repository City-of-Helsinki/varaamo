import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Marker } from 'react-leaflet';
import simple from 'simple-mock';

import { getOwnerMarkerIcon } from 'screens/utils';
import Markers from './Markers';
import Popup from './popup';

function getWrapper(props) {
  const defaults = { markers: [] };
  return shallow(<Markers {...defaults} {...props} />);
}

function getInstance(props) {
  return getWrapper(props).instance();
}

describe('screens/map/Markers', () => {
  it('has correct initial state', () => {
    const instance = getInstance();
    expect(instance.state).to.deep.equal({
      isClicked: false,
    });
  });

  describe('handleClick', () => {
    it('opens popup', () => {
      const openPopup = simple.mock();
      getInstance().handleClick({ target: { openPopup } });
      expect(openPopup.callCount).to.equal(1);
    });

    it('sets isClicked = true', () => {
      const instance = getInstance();
      instance.handleClick({ target: { openPopup: () => null } });
      expect(instance.state.isClicked).to.be.true;
    });
  });

  describe('handleClose', () => {
    it('sets isClicked = false', () => {
      const instance = getInstance();
      instance.state.isClicked = true;
      instance.handleClose();
      expect(instance.state.isClicked).to.be.false;
    });
  });

  describe('handleMouseOut', () => {
    it('closes popup if not clicked', () => {
      const closePopup = simple.mock();
      getInstance().handleMouseOut({ target: { closePopup } });
      expect(closePopup.callCount).to.equal(1);
    });

    it('does not close popup if clicked', () => {
      const closePopup = simple.mock();
      const instance = getInstance();
      instance.state.isClicked = true;
      instance.handleMouseOut({ target: { closePopup } });
      expect(closePopup.called).to.be.false;
    });
  });

  describe('handleMouseOver', () => {
    it('opens popup if not clicked', () => {
      const openPopup = simple.mock();
      getInstance().handleMouseOver({ target: { openPopup } });
      expect(openPopup.callCount).to.equal(1);
    });

    it('does not open popup if clicked', () => {
      const openPopup = simple.mock();
      const instance = getInstance();
      instance.state.isClicked = true;
      instance.handleMouseOver({ target: { openPopup } });
      expect(openPopup.called).to.be.false;
    });
  });

  describe('markers', () => {
    it('are not rendered if none exist', () => {
      const markers = getWrapper().find(Marker);
      expect(markers).to.have.length(0);
    });

    it('have correct event handlers', () => {
      const wrapper = getWrapper({ markers: [{ id: '1', latitude: 0, longitude: 1, owner: 'ta' }] });
      const instance = wrapper.instance();
      const marker = wrapper.find(Marker);
      expect(marker.prop('onClick')).to.equal(instance.handleClick);
      expect(marker.prop('onMouseOut')).to.equal(instance.handleMouseOut);
      expect(marker.prop('onMouseOver')).to.equal(instance.handleMouseOver);
      expect(marker.prop('onPopupClose')).to.equal(instance.handleClose);
    });

    it('are rendered at correct positions', () => {
      const positions = [
        { id: '1', latitude: 0, longitude: 1, owner: 'ta' },
        { id: '2', latitude: 2, longitude: 3, owner: 'ta' },
        { id: '3', latitude: 4, longitude: 5, owner: 'ta' },
      ];
      const markers = getWrapper({ markers: positions }).find(Marker);
      expect(markers).to.have.length(3);
      expect(markers.at(0).prop('position')).to.deep.equal([0, 1]);
      expect(markers.at(1).prop('position')).to.deep.equal([2, 3]);
      expect(markers.at(2).prop('position')).to.deep.equal([4, 5]);
    });

    it('are rendered with correct icons', () => {
      const data = [
        { id: '1', latitude: 0, longitude: 1, owner: 'AVAIN Asumisoikeus Oy' },
      ];
      const markers = getWrapper({ markers: data }).find(Marker);
      expect(markers.at(0).prop('icon')).to.equal(getOwnerMarkerIcon('AVAIN Asumisoikeus Oy'));
    });

    it('have popups as children', () => {
      const markers = [{ id: '32', latitude: 0, longitude: 0, owner: 'ta' }];
      const marker = getWrapper({ markers }).find(Marker);
      const popup = marker.find(Popup);
      expect(popup).to.have.length(1);
      expect(popup.prop('id')).to.equal('32');
    });
  });
});
