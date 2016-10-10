import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openReservationCommentModal, selectReservationToShow } from 'actions/uiActions';
import CommentButton from './CommentButton';

export class UnconnectedCommentButtonContainer extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { actions, reservation } = this.props;
    actions.selectReservationToShow(reservation);
    actions.openReservationCommentModal();
  }

  render() {
    return <CommentButton onClick={this.handleClick} />;
  }
}

UnconnectedCommentButtonContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  reservation: PropTypes.shape({
    comments: PropTypes.string,
  }).isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    openReservationCommentModal,
    selectReservationToShow,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(null, mapDispatchToProps)(UnconnectedCommentButtonContainer);
