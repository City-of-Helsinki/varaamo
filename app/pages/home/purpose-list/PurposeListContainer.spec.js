import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import PurposeListComponent from './PurposeListComponent';
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

    it('renders PurposeListComponent with correct props', () => {
      const purposeListComponent = getWrapper().find(PurposeListComponent);
      expect(purposeListComponent).to.have.length(1);
      expect(purposeListComponent.props().purposes).to.deep.equal(defaultProps.purposes);
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
