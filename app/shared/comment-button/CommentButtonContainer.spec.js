import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import CommentButton from './CommentButton';
import { UnconnectedCommentButtonContainer } from './CommentButtonContainer';

describe('shared/comment-button/CommentButtonContainer', () => {
  const reservation = {
    comments: 'some comments',
  };

  const defaultProps = {
    actions: {
      openReservationCommentModal: simple.mock(),
      selectReservationToShow: simple.mock(),
    },
    reservation,
  };

  function getWrapper(props) {
    return shallow(<UnconnectedCommentButtonContainer {...defaultProps} {...props} />);
  }
  let wrapper;

  before(() => {
    wrapper = getWrapper();
  });

  it('renders a CommentButton', () => {
    const commentButton = wrapper.find(CommentButton);
    expect(commentButton.length).to.equal(1);
  });

  it('passes correct onClick prop to CommentButton', () => {
    const commentButton = wrapper.find(CommentButton);
    const expected = wrapper.instance().handleClick;

    expect(commentButton.prop('onClick')).to.equal(expected);
  });

  describe('handleClick', () => {
    let instance;

    before(() => {
      instance = wrapper.instance();
    });

    beforeEach(() => {
      defaultProps.actions.openReservationCommentModal.reset();
      defaultProps.actions.selectReservationToShow.reset();
    });

    it('calls selectReservationToShow with the reservation', () => {
      instance.handleClick();
      expect(defaultProps.actions.selectReservationToShow.callCount).to.equal(1);
      expect(defaultProps.actions.selectReservationToShow.lastCall.args[0])
        .to.deep.equal(reservation);
    });

    it('calls openReservationCommentModal', () => {
      instance.handleClick();
      expect(defaultProps.actions.openReservationCommentModal.callCount).to.equal(1);
    });
  });
});
