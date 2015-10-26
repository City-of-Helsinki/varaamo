import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon, Input } from 'react-bootstrap';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const searchValue = this.refs.searchInput.getValue();
    this.props.onSubmit(searchValue);
  }

  render() {
    const { initialValue } = this.props;
    const searchGlyphicon = <Glyphicon glyph="search" />;
    const submitButton = <Button bsStyle="primary" type="submit">Hae</Button>;

    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          addonBefore={searchGlyphicon}
          autoFocus
          buttonAfter={submitButton}
          defaultValue={initialValue}
          placeholder="Etsi tilan nimellä"
          ref="searchInput"
          type="text"
        />
      </form>
    );
  }
}

SearchInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired,
};

export default SearchInput;
