import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import PopoverOverlay from '../../../../common/popover/PopoverOverlay';
import commentIcon from '../../../../../app/assets/icons/comment.svg';

const ManageReservationsComment = ({ comments }) => (
  <div className="app-ManageReservationComments">
    {comments && (
    <PopoverOverlay
      content={<p>{comments}</p>}
      placement="top"
      title={<FormattedMessage id="CommentForm.label" />}
    >
      <img alt="manageReservationCommentIcon" src={commentIcon} />
    </PopoverOverlay>
    )}
  </div>
);
ManageReservationsComment.propTypes = {
  comments: PropTypes.string
};

export default ManageReservationsComment;
