import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import UserReservationsPage from 'containers/UserReservationsPage';

describe('Container: UserReservationsPage', () => {
  const props = {};
  const tree = sd.shallowRender(<UserReservationsPage {...props} />);

  it('should display "Omat varaukset" -title inside h1 tags', () => {
    const h1Tree = tree.subTree('h1');

    expect(h1Tree.props.children).to.equal('Omat varaukset');
  });
});
