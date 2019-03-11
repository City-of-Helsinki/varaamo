import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import CommentForm from 'shared/comment-form';
import { UnconnectedCommentModalContainer as CommentModalContainer } from './CommentModalContainer';
import ModalWrapper from '../ModalWrapper';

describe('shared/modals/comment/CommentModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({
    comments: 'Some comments',
    resource: resource.id,
  });
  const defaultProps = {
    actions: {
      closeReservationCommentModal: simple.stub(),
      commentReservation: simple.stub(),
    },
    isSaving: false,
    reservation: Immutable(reservation),
    resource: Immutable(resource),
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<CommentModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a ModalWrapper with correct props', () => {
      const modalWrapper = getWrapper().find(ModalWrapper);

      expect(modalWrapper.length).toBe(1);
      expect(modalWrapper.prop('onClose')).toBe(defaultProps.actions.closeReservationCommentModal);
      expect(modalWrapper.prop('show')).toBe(defaultProps.show);
    });

    test('renders CommentForm with correct props', () => {
      const wrapper = getWrapper();
      const commentForm = wrapper.find(CommentForm);

      expect(commentForm.length).toBe(1);
      expect(commentForm.prop('defaultValue')).toBe(reservation.comments);
      expect(commentForm.prop('isSaving')).toBe(defaultProps.isSaving);
      expect(commentForm.prop('onCancel')).toBe(defaultProps.actions.closeReservationCommentModal);
      expect(commentForm.prop('onSave')).toBe(wrapper.instance().handleSave);
    });
  });

  describe('handleSave', () => {
    const comments = 'Some comments';

    beforeAll(() => {
      const instance = getWrapper().instance();
      defaultProps.actions.closeReservationCommentModal.reset();
      defaultProps.actions.commentReservation.reset();
      instance.handleSave(comments);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls commentReservation', () => {
      expect(defaultProps.actions.commentReservation.callCount).toBe(1);
    });

    test('calls commentReservation with correct arguments', () => {
      const actualArgs = defaultProps.actions.commentReservation.lastCall.args;

      expect(actualArgs[0]).toEqual(reservation);
      expect(actualArgs[1]).toEqual(resource);
      expect(actualArgs[2]).toEqual(comments);
    });

    test('closes the CommentModal', () => {
      expect(defaultProps.actions.closeReservationCommentModal.callCount).toBe(1);
    });
  });
});
