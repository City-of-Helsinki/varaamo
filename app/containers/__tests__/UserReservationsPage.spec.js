import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import UserReservationsPage from 'containers/UserReservationsPage';

describe('Container: UserReservationsPage', () => {
  const props = {};
  const tree = sd.shallowRender(<UserReservationsPage {...props} />);

  it('should display "Omat varaukset" -title inside h1 tags', () => {
    const h1Vdom = tree.subTree('h1').getRenderOutput();

    expect(h1Vdom.props.children).to.equal('Omat varaukset');
  });
});
