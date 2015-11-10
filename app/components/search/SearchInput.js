import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const searchValue = this.refs.searchInput.getValue();
    this.props.onSubmit(searchValue);
  }

  render() {
    const { autoFocus } = this.props;
    const submitButton = <Button bsStyle="primary" type="submit">Hae</Button>;

    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          autoFocus={autoFocus}
          buttonAfter={submitButton}
          onChange={(event) => {
            this.setState({ value: event.target.value });
          }}
          placeholder="Etsi tilan nimellä"
          ref="searchInput"
          type="text"
          value={this.state.value}
        />
      </form>
    );
  }
}

SearchInput.propTypes = {
  autoFocus: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchInput;
