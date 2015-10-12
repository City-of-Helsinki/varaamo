import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import SearchResults from 'components/search/SearchResults';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: search/SearchResults', () => {
  describe('with results', () => {
    const unit = Unit.build();
    const props = {
      results: Immutable([
        Resource.build({ unit: unit.id }),
        Resource.build({ unit: 'unfetched-unit' }),
      ]),
      units: Immutable({
        [unit.id]: unit,
      }),
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<SearchResults {...props} />);
    });

    it('should render a Table component', () => {
      const tableTrees = tree.everySubTree('Table');

      expect(tableTrees.length).to.equal(1);
    });

    describe('rendering table headers', () => {
      let thTrees;

      before(() => {
        thTrees = tree.everySubTree('th');
      });

      it('should render 2 th elements', () => {
        expect(thTrees.length).to.equal(2);
      });

      it('first th element should contain text "Tila"', () => {
        expect(thTrees[0].text()).to.equal('Tila');
      });

      it('second th element should contain text "Sijainti"', () => {
        expect(thTrees[1].text()).to.equal('Sijainti');
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

      it('should pass result as a prop to SearchResult', () => {
        resultTrees.forEach((resultTree, index) => {
          const resultVdom = resultTree.getRenderOutput();

          expect(resultVdom.props.result).to.deep.equal(props.results[index]);
        });
      });

      it('should pass unit corresponding to result.unit as a prop to SearchResult', () => {
        const resultVdom = resultTrees[0].getRenderOutput();

        expect(resultVdom.props.unit).to.deep.equal(unit);
      });

      it('should pass empty object as unit prop to SearchResult if unit is unfetched', () => {
        const resultVdom = resultTrees[1].getRenderOutput();

        expect(resultVdom.props.unit).to.deep.equal({});
      });
    });
  });

  describe('without results', () => {
    const props = {
      results: [],
      units: {},
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<SearchResults {...props} />);
    });

    it('should render a message telling no results were found', () => {
      const expected = 'Yhtään hakutulosta ei löytynyt.';

      expect(tree.textIn('p')).to.equal(expected);
    });
  });
});
