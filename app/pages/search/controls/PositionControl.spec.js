import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import { shallowWithIntl } from 'utils/testUtils';
import PositionControl from './PositionControl';

function getWrapper(props) {
  const defaults = {
    geolocated: false,
    onPositionSwitch: () => null,
  };
  return shallowWithIntl(<PositionControl {...defaults} {...props} />);
}

describe('pages/search/controls/PositionControl', () => {
  it('renders a div.app-PositionControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PositionControl')).to.be.true;
  });

  describe('Button', () => {
    it('does not have active class if not geolocated', () => {
      const button = getWrapper({ geolocated: false }).find(Button);
      expect(button.prop('className')).to.not.contain('active');
    });

    it('has active class if geolocated', () => {
      const button = getWrapper({ geolocated: true }).find(Button);
      expect(button.prop('className')).to.contain('active');
    });

    it('has onPositionSwitch as onClick prop', () => {
      const onPositionSwitch = () => {};
      const button = getWrapper({ onPositionSwitch }).find(Button);
      expect(button.prop('onClick')).to.equal(onPositionSwitch);
    });
  });
});
