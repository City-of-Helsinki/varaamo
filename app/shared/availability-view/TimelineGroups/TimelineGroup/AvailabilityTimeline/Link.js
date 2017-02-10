import React, { PropTypes } from 'react';
import { Link as RRLink } from 'react-router';

export default class Link extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleDown = this.handleDown.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { down: false, preventClick: false };
  }

  handleDown() {
    this.setState({ down: true, preventClick: false });
  }

  handleMove() {
    if (this.state.down && !this.state.preventClick) {
      this.setState({ preventClick: true });
    }
  }

  handleUp() {
    this.setState({ down: false });
  }

  handleClick(e) {
    if (this.state.preventClick) {
      e.preventDefault();
      this.setState({ preventClick: false });
    } else {
      this.props.onClick(e);
    }
  }

  render() {
    return (
      <RRLink
        {...this.props}
        onClick={this.handleClick}
        onMouseDown={this.handleDown}
        onMouseMove={this.handleMove}
        onMouseUp={this.handleUp}
      />
    );
  }
}
