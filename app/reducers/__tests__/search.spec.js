import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

import {List, Map} from 'immutable';

import {fetchResourcesStart, fetchResourcesSuccess} from 'actions/resourceActions';
import {searchReducer as reducer} from 'reducers/search';

chai.use(chaiImmutable);

describe('Reducer: searchReducer', () => {
  describe('initial state', () => {
    let initialState;

    before(() => {
      initialState = reducer(undefined, {});
    });

    it('should be a Map', () => {
      expect(Map.isMap(initialState)).to.be.true;
    });

    it('category should be "all"', () => {
      expect(initialState.get('category')).to.equal('all');
    });

    describe('searchResults', () => {
      let searchResults;

      before(() => {
        searchResults = initialState.get('searchResults');
      });

      it('should be a Map', () => {
        expect(Map.isMap(searchResults)).to.be.true;
      });

      it('searchResults.ids as an empty List', () => {
        expect(searchResults.get('ids')).to.equal(List());
      });

      it('searchResults.isFetching should be false', () => {
        expect(searchResults.get('isFetching')).to.be.false;
      });
    });
  });

  describe('handling actions', () => {
    describe('FETCH_RESOURCES_START', () => {
      it('should set searchResults.isFetching to true', () => {
        const action = fetchResourcesStart();
        const initialState = Map({
          searchResults: Map({
            isFetching: false,
            ids: List(),
          }),
        });
        const newState = reducer(initialState, action);
        expect(newState.getIn(['searchResults', 'isFetching'])).to.be.true;
      });
    });

    describe('FETCH_RESOURCES_SUCCESS', () => {
      const resources = [
        {id: 'r-1', name: 'some resource'},
        {id: 'r-2', name: 'other resource'},
      ];

      it('should set searchResults.isFetching to false', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Map({
          searchResults: Map({
            isFetching: true,
            ids: List(),
          }),
        });
        const newState = reducer(initialState, action);
        expect(newState.getIn(['searchResults', 'isFetching'])).to.be.false;
      });

      it('should set the given resource ids to searchResults.ids', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Map({
          searchResults: Map({
            isFetching: true,
            ids: List(),
          }),
        });
        const expectedIds = List(['r-1', 'r-2']);
        const newState = reducer(initialState, action);
        expect(newState.getIn(['searchResults', 'ids'])).to.be.equal(expectedIds);
      });

      it('should replace the old ids in searchResults.ids', () => {
        const action = fetchResourcesSuccess(resources);
        const initialState = Map({
          searchResults: Map({
            isFetching: true,
            ids: List(['replace-this']),
          }),
        });
        const expectedIds = List(['r-1', 'r-2']);
        const newState = reducer(initialState, action);
        expect(newState.getIn(['searchResults', 'ids'])).to.be.equal(expectedIds);
      });
    });
  });
});
