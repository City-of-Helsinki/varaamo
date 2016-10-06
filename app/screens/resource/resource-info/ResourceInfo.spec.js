import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import { getAddressWithName } from 'utils/unitUtils';
import ResourceInfo from './ResourceInfo';

describe('screens/resource/resource-info/ResourceInfo', () => {
  const defaultProps = {
    resource: Immutable(Resource.build()),
    unit: Immutable(Unit.build()),
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceInfo {...defaultProps} {...extraProps} />);
  }

  it('renders the name of the resource inside a h1 header', () => {
    const header = getWrapper().find('h1');
    const expected = defaultProps.resource.name.fi;

    expect(header.props().children).to.equal(expected);
  });

  it('renders the unit address with name inside an address tag', () => {
    const address = getWrapper().find('address');
    const expected = getAddressWithName(defaultProps.unit);

    expect(address.props().children).to.equal(expected);
  });
});
