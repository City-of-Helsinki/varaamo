import React from 'react';
import { Panel } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import commentIcon from '../../../../../app/assets/icons/comment.svg';
import TooltipOverlay from '../../../../common/tooltip/TooltipOverlay';

export default function ManageReservationComment({ comments }) {
  return (
    comments && (
    <TooltipOverlay
      className="app-ManageReservationComments"
      content={(
        <div className="app-ManageReservationComments__tooltip">
          <Panel>
            <Panel.Body>
              <Panel.Title><FormattedMessage id="CommentForm.label" /></Panel.Title>
              <p>{comments}</p>
            </Panel.Body>
          </Panel>
        </div>
      )}
    >
      <img alt="manageReservationCommentIcon" src={commentIcon} />

    </TooltipOverlay>
    )
  );
}
