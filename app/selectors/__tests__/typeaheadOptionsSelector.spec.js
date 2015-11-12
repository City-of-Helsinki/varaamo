import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import typeaheadOptionsSelector from 'selectors/typeaheadOptionsSelector';

function getState(suggestions) {
  const units = _.map(suggestions, (suggestion) => {
    return Unit.build({ id: suggestion.unit });
  });
  return {
    data: Immutable({
      units: _.indexBy(units, 'id'),
    }),
    ui: Immutable({
      search: {
        typeaheadSuggestions: suggestions,
      },
    }),
  };
}

describe('Selector: typeaheadOptionsSelector', () => {
  const suggestions = [
    Resource.build(),
    Resource.build(),
  ];

  it('should return an empty array if state contains no suggestions', () => {
    const state = getState([]);
    const actual = typeaheadOptionsSelector(state);

    expect(actual).to.deep.equal([]);
  });

  it('should return an option object for each typeaheadSuggestion in state', () => {
    const state = getState(suggestions);
    const actual = typeaheadOptionsSelector(state);

    expect(actual.length).to.equal(suggestions.length);
  });

  describe('a returned option object', () => {
    const suggestion = suggestions[0];
    const state = getState([suggestion]);
    const option = typeaheadOptionsSelector(state)[0];

    it('should have suggestion.id as its id property', () => {
      expect(option.id).to.equal(suggestion.id);
    });

    it('should have suggestion.name.fi as its name property', () => {
      expect(option.name).to.equal(suggestion.name.fi);
    });

    it('should have unit.name.fi as its unitName property', () => {
      const unit = state.data.units[suggestion.unit];
      expect(option.unitName).to.equal(unit.name.fi);
    });
  });

  it('should work for multiple suggestions', () => {
    const state = getState(suggestions);
    const actual = typeaheadOptionsSelector(state);
    const expected = Immutable([
      {
        id: suggestions[0].id,
        name: suggestions[0].name.fi,
        unitName: state.data.units[suggestions[0].unit].name.fi,
      },
      {
        id: suggestions[1].id,
        name: suggestions[1].name.fi,
        unitName: state.data.units[suggestions[1].unit].name.fi,
      },
    ]);

    expect(actual).to.deep.equal(expected);
  });
});
