import { expect } from 'chai';
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
    isEditingReservations: false,
    reservation: Immutable(reservation),
    resource: Immutable(resource),
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<CommentModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders a ModalWrapper with correct props', () => {
      const modalWrapper = getWrapper().find(ModalWrapper);

      expect(modalWrapper.length).to.equal(1);
      expect(modalWrapper.prop('onClose')).to.equal(
        defaultProps.actions.closeReservationCommentModal
      );
      expect(modalWrapper.prop('show')).to.equal(defaultProps.show);
    });

    it('renders CommentForm with correct props', () => {
      const wrapper = getWrapper();
      const commentForm = wrapper.find(CommentForm);

      expect(commentForm.length).to.equal(1);
      expect(commentForm.prop('defaultValue')).to.equal(reservation.comments);
      expect(commentForm.prop('isSaving')).to.equal(defaultProps.isEditingReservations);
      expect(commentForm.prop('onCancel')).to.equal(
        defaultProps.actions.closeReservationCommentModal
      );
      expect(commentForm.prop('onSave')).to.equal(wrapper.instance().handleSave);
    });
  });

  describe('handleSave', () => {
    const comments = 'Some comments';

    before(() => {
      const instance = getWrapper().instance();
      defaultProps.actions.closeReservationCommentModal.reset();
      defaultProps.actions.commentReservation.reset();
      instance.handleSave(comments);
    });

    after(() => {
      simple.restore();
    });

    it('calls commentReservation', () => {
      expect(defaultProps.actions.commentReservation.callCount).to.equal(1);
    });

    it('calls commentReservation with correct arguments', () => {
      const actualArgs = defaultProps.actions.commentReservation.lastCall.args;

      expect(actualArgs[0]).to.deep.equal(reservation);
      expect(actualArgs[1]).to.deep.equal(resource);
      expect(actualArgs[2]).to.deep.equal(comments);
    });

    it('closes the CommentModal', () => {
      expect(defaultProps.actions.closeReservationCommentModal.callCount).to.equal(1);
    });
  });
});
