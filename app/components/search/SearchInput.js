import React, { Component, PropTypes } from 'react';
import { Typeahead } from 'react-typeahead';

import TypeaheadList from 'components/search/TypeaheadList';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleTypeaheadSuggestionSelect = this.handleTypeaheadSuggestionSelect.bind(this);
  }

  componentDidUpdate() {
    // For some reason the typeahead input value is not updated on render when the value is ''.
    // A related issue maybe: https://github.com/fmoo/react-typeahead/issues/126
    if (this.props.value === '') {
      this.refs.typeahead.setEntryText(this.props.value);
    }
  }

  handleKeyUp(event) {
    const value = event.target.value;
    this.props.onChange(value);
    if (event.keyCode === 13) {
      this.props.onSubmit();
    }
  }

  handleTypeaheadSuggestionSelect(suggestion) {
    this.props.updatePath(`/resources/${suggestion.id}`);
  }

  render() {
    const {
      autoFocus,
      onSubmit,
      typeaheadOptions,
      value,
    } = this.props;

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="form-group">
          <Typeahead
            customClasses={{ input: 'form-control' }}
            customListComponent={TypeaheadList}
            displayOption="name"
            filterOption={() => true}
            inputProps={{ autoFocus }}
            maxVisible={4}
            ref="typeahead"
            onKeyUp={this.handleKeyUp}
            onOptionSelected={this.handleTypeaheadSuggestionSelect}
            options={typeaheadOptions}
            value={value}
          />
        </div>
      </form>
    );
  }
}

SearchInput.propTypes = {
  autoFocus: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  typeaheadOptions: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchInput;
