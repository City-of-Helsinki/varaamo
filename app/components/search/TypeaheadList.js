import React, { Component, PropTypes } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class TypeaheadList extends Component {
  constructor(props) {
    super(props);
    this.renderOption = this.renderOption.bind(this);
  }

  renderOption(option, index) {
    const { onOptionSelected, selectionIndex } = this.props;

    return (
      <ListGroupItem
        active={index === selectionIndex}
        header={option.name}
        key={option.id}
        onClick={() => onOptionSelected(option)}
      >
        {option.unitName}
      </ListGroupItem>
    );
  }

  render() {
    return (
      <ListGroup className="typeahead-list">
        {this.props.options.map(this.renderOption)}
      </ListGroup>
    );
  }
}

TypeaheadList.propTypes = {
  onOptionSelected: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selectionIndex: PropTypes.number,
};

export default TypeaheadList;
