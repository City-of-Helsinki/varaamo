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

  beforeAll(() => {
    wrapper = getWrapper();
  });

  test('renders a CommentButton', () => {
    const commentButton = wrapper.find(CommentButton);
    expect(commentButton.length).toBe(1);
  });

  test('passes correct onClick prop to CommentButton', () => {
    const commentButton = wrapper.find(CommentButton);
    const expected = wrapper.instance().handleClick;

    expect(commentButton.prop('onClick')).toBe(expected);
  });

  describe('handleClick', () => {
    let instance;

    beforeAll(() => {
      instance = wrapper.instance();
    });

    beforeEach(() => {
      defaultProps.actions.openReservationCommentModal.reset();
      defaultProps.actions.selectReservationToShow.reset();
    });

    test('calls selectReservationToShow with the reservation', () => {
      instance.handleClick();
      expect(defaultProps.actions.selectReservationToShow.callCount).toBe(1);
      expect(defaultProps.actions.selectReservationToShow.lastCall.args[0]).toEqual(reservation);
    });

    test('calls openReservationCommentModal', () => {
      instance.handleClick();
      expect(defaultProps.actions.openReservationCommentModal.callCount).toBe(1);
    });
  });
});
