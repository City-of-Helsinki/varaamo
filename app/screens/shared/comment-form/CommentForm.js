import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { findDOMNode } from 'react-dom';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const comments = findDOMNode(this.refs.commentsInput).value;
    this.props.onSave(comments);
  }

  render() {
    const { defaultValue, isSaving, onCancel } = this.props;

    return (
      <form className="comment-form">
        <FormGroup controlId="commentsTextarea">
          <ControlLabel>Kommentit:</ControlLabel>
          <FormControl
            componentClass="textarea"
            defaultValue={defaultValue}
            placeholder="Varauksen mahdolliset lisätiedot"
            ref="commentsInput"
            rows={5}
          />
        </FormGroup>
        <div className="buttons">
          <Button
            bsStyle="default"
            onClick={onCancel}
          >
            Takaisin
          </Button>
          <Button
            bsStyle="success"
            disabled={isSaving}
            onClick={this.handleSave}
            type="submit"
          >
            {isSaving ? 'Tallennetaan...' : 'Tallenna'}
          </Button>
        </div>
      </form>
    );
  }
}

CommentForm.propTypes = {
  defaultValue: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CommentForm;
