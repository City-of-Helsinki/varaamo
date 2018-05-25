import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';

import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceMapInfo from './ResourceMapInfo';

describe('pages/resource/resource-map-info/ResourceMapInfo', () => {
  const defaultProps = {
    unit: Immutable(Unit.build({ id: 'aaa:123' })),
  };

  function getWrapper() {
    return shallowWithIntl(<ResourceMapInfo {...defaultProps} />);
  }

  it('renders Service map link as a Button with correct url', () => {
    const button = getWrapper().find(Button);
    const expected = 'https://palvelukartta.hel.fi/unit/123#!route-details';

    expect(button).to.have.length(1);
    expect(button.prop('href')).to.equal(expected);
  });
});
