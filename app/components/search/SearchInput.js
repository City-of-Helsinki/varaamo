import React, { Component, PropTypes } from 'react';
import { Input } from 'react-bootstrap';

class SearchInput extends Component {
  render() {
    const { autoFocus, onChange, onSubmit, value } = this.props;

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Etsi tilan nimellä"
          ref="searchInput"
          type="text"
          value={value}
        />
      </form>
    );
  }
}

SearchInput.propTypes = {
  autoFocus: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchInput;
