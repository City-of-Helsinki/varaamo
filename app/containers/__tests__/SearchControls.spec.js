import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import { UnconnectedSearchControls as SearchControls } from 'containers/SearchControls';

describe('Container: SearchControls', () => {
  const props = {
    actions: {
      changePurposeFilter: simple.stub(),
      fetchPurposes: simple.stub(),
    },
    isFetchingPurposes: false,
    purposeFilter: 'some-filter',
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
  };

  const tree = sd.shallowRender(<SearchControls {...props} />);

  describe('rendering SearchFilters', () => {
    const searchFiltersTrees = tree.everySubTree('SearchFilters');

    it('should render SearchFilters component', () => {
      expect(searchFiltersTrees.length).to.equal(1);
    });

    it('should pass correct props to SearchFilters component', () => {
      const searchFiltersVdom = searchFiltersTrees[0].getRenderOutput();
      const actualProps = searchFiltersVdom.props;

      expect(actualProps.isFetchingPurposes).to.equal(props.isFetchingPurposes);
      expect(actualProps.onPurposeFilterChange).to.equal(props.actions.changePurposeFilter);
      expect(actualProps.purposeOptions).to.deep.equal(props.purposeOptions);
      expect(actualProps.purposeFilter).to.equal(props.purposeFilter);
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();

      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
