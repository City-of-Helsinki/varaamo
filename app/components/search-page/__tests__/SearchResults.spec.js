import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import SearchResults from 'components/search-page/SearchResults';
import Resource from 'fixtures/Resource';

describe('Component: SearchResults', () => {
  const props = {
    results: Immutable([
      Resource.build(),
      Resource.build(),
    ]),
  };
  let tree;

  before(() => {
    tree = sd.shallowRender(<SearchResults {...props} />);
  });

  describe('basic rendering', () => {
    it('should render a Table component', () => {
      const tableTrees = tree.everySubTree('Table');

      expect(tableTrees.length).to.equal(1);
    });
  });

  describe('rendering table headers', () => {
    let thTrees;

    before(() => {
      thTrees = tree.everySubTree('th');
    });

    it('should render 2 th elements', () => {
      expect(thTrees.length).to.equal(2);
    });

    it('first th element should contain text "Nimi"', () => {
      expect(thTrees[0].text()).to.equal('Nimi');
    });

    it('second th element should contain text "Yksikkö"', () => {
      expect(thTrees[1].text()).to.equal('Yksikkö');
    });
  });

  describe('rendering individual results', () => {
    let resultTrees;

    before(() => {
      resultTrees = tree.everySubTree('SearchResult');
    });

    it('should render a SearchResult for every result in props', () => {
      expect(resultTrees.length).to.equal(props.results.length);
    });
  });
});
