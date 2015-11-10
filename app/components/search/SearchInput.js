import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';

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
    const { autoFocus, initialValue } = this.props;
    const submitButton = <Button bsStyle="primary" type="submit">Hae</Button>;

    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          autoFocus={autoFocus}
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
  autoFocus: PropTypes.bool.isRequired,
  initialValue: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchInput;
