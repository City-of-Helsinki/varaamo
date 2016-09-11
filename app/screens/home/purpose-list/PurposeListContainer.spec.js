import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import { UnconnectedPurposeListContainer as PurposeListContainer } from './PurposeListContainer';

describe('screens/home/purpose-list/PurposeListContainer', () => {
  const props = {
    actions: {
      fetchPurposes: simple.stub(),
    },
    isFetchingPurposes: false,
    groupedPurposes: Immutable({
      someParent: [Purpose.build()],
      otherParent: [Purpose.build()],
    }),
    purposeCategories: Immutable({
      someParent: Purpose.build(),
      otherParent: Purpose.build(),
    }),
  };
  const tree = sd.shallowRender(<PurposeListContainer {...props} />);

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch purposes when component mounts', () => {
      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
