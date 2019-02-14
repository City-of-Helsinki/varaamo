import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeReservationCommentModal } from 'actions/uiActions';
import { commentReservation } from 'actions/reservationActions';
import CommentForm from 'shared/comment-form';
import { injectT } from 'i18n';

import commentModalSelector from './commentModalSelector';
import ModalWrapper from '../ModalWrapper';

class UnconnectedCommentModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(comments) {
    const { actions, reservation, resource } = this.props;
    actions.commentReservation(reservation, resource, comments);
    actions.closeReservationCommentModal();
  }

  render() {
    const {
      actions,
      isSaving,
      reservation,
      show,
      t
    } = this.props;

    return (
      <ModalWrapper
        className="comment-modal"
        onClose={actions.closeReservationCommentModal}
        show={show}
        title={t('CommentModal.title')}
      >
        <CommentForm
          defaultValue={reservation.comments}
          isSaving={isSaving}
          onCancel={actions.closeReservationCommentModal}
          onSave={this.handleSave}
        />
      </ModalWrapper>
    );
  }
}

UnconnectedCommentModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

UnconnectedCommentModalContainer = injectT(UnconnectedCommentModalContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCommentModal,
    commentReservation
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedCommentModalContainer };
export default connect(commentModalSelector, mapDispatchToProps)(UnconnectedCommentModalContainer);
