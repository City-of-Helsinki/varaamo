import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';
import Immutable from 'seamless-immutable';

import Purpose from 'utils/fixtures/Purpose';
import PurposeList from './PurposeList';
import { UnconnectedPurposeListContainer as PurposeListContainer } from './PurposeListContainer';

describe('pages/home/purpose-list/PurposeListContainer', () => {
  const defaultProps = {
    actions: {
      fetchPurposes: simple.stub(),
    },
    isFetchingPurposes: false,
    purposes: Immutable([
      Purpose.build(),
      Purpose.build(),
    ]),
  };

  function getWrapper(extraProps) {
    return shallow(<PurposeListContainer {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    describe('Loader', () => {
      it('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      it('is loaded if isFetchingPurposes is false', () => {
        const loader = getWrapper({ isFetchingPurposes: false }).find(Loader);
        expect(loader.props().loaded).to.be.true;
      });

      it('is not loaded if isFetchingPurposes is true', () => {
        const loader = getWrapper({ isFetchingPurposes: true }).find(Loader);
        expect(loader.props().loaded).to.be.false;
      });
    });

    it('renders PurposeList with correct props', () => {
      const purposeList = getWrapper().find(PurposeList);
      expect(purposeList).to.have.length(1);
      expect(purposeList.props().purposes).to.deep.equal(defaultProps.purposes);
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = getWrapper().instance();
      instance.componentDidMount();
    });

    it('fetches purposes when component mounts', () => {
      expect(defaultProps.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
