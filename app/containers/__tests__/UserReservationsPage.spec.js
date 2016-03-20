import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import {
  UnconnectedUserReservationsPage as UserReservationsPage,
} from 'containers/UserReservationsPage';

describe('Container: UserReservationsPage', () => {
  const props = {
    actions: {
      fetchReservations: simple.stub(),
      fetchResources: simple.stub(),
      fetchUnits: simple.stub(),
    },
  };
  const tree = sd.shallowRender(<UserReservationsPage {...props} />);

  it('should display "Omat varaukset" -title inside h1 tags', () => {
    const h1Tree = tree.subTree('h1');

    expect(h1Tree.props.children).to.equal('Omat varaukset');
  });

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch reservations when component mounts', () => {
      expect(props.actions.fetchReservations.callCount).to.equal(1);
    });

    it('should only fetch user\'s own reservations when component mounts', () => {
      expect(props.actions.fetchReservations.lastCall.args[0].isOwn).to.equal(true);
    });

    it('should fetch resources when component mounts', () => {
      expect(props.actions.fetchResources.callCount).to.equal(1);
    });

    it('should fetch units when component mounts', () => {
      expect(props.actions.fetchUnits.callCount).to.equal(1);
    });
  });
});
