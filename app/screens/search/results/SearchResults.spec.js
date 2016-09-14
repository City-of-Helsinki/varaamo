import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import ResourceList from 'screens/shared/resource-list';
import SearchResults from './SearchResults';

describe('screens/search/results/SearchResults', () => {
  const unit = Unit.build();
  const defaultProps = {
    date: '2015-10-10',
    isFetching: false,
    results: Immutable([
      Resource.build({ unit: unit.id }),
      Resource.build({ unit: 'unfetched-unit' }),
    ]),
    units: Immutable({
      [unit.id]: unit,
    }),
  };

  function getWrapper(extraProps) {
    return shallow(<SearchResults {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    describe('Loader', () => {
      it('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      it('is loaded if isFetching is false', () => {
        const loader = getWrapper({ isFetching: false }).find(Loader);
        expect(loader.props().loaded).to.be.true;
      });

      it('is not loaded if isFetching is true', () => {
        const loader = getWrapper({ isFetching: true }).find(Loader);
        expect(loader.props().loaded).to.be.false;
      });
    });

    it('renders ResourceList with correct props', () => {
      const resourceList = getWrapper().find(ResourceList);
      expect(resourceList).to.have.length(1);
      expect(resourceList.props().date).to.deep.equal(defaultProps.date);
      expect(resourceList.props().resources).to.deep.equal(defaultProps.results);
      expect(resourceList.props().units).to.deep.equal(defaultProps.units);
    });
  });
});
