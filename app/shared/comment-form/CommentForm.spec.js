import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import { makeButtonTests, shallowWithIntl } from 'utils/testUtils';
import CommentForm from './CommentForm';

describe('shared/comment-form/CommentForm', () => {
  const defaultProps = {
    defaultValue: 'This is a comment',
    isSaving: false,
    onCancel: simple.stub(),
    onSave: simple.stub(),
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<CommentForm {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a form', () => {
      const form = getWrapper().find('form');

      expect(form.length).toBe(1);
    });

    describe('comments textarea', () => {
      test('renders a FormControl with correct props', () => {
        const formControl = getWrapper().find(FormControl);

        expect(formControl.length).toBe(1);
        expect(formControl.prop('componentClass')).toBe('textarea');
        expect(formControl.prop('defaultValue')).toBe(defaultProps.defaultValue);
      });
    });

    describe('form buttons', () => {
      const wrapper = getWrapper();
      const buttons = wrapper.find(Button);

      test('renders two buttons', () => {
        expect(buttons.length).toBe(2);
      });

      describe('the first button', () => {
        makeButtonTests(
          buttons.at(0),
          'back',
          'common.back',
          defaultProps.onCancel
        );
      });

      describe('the second button', () => {
        const button = buttons.at(1);

        test('is save button', () => {
          expect(button.props().children).toBe('common.save');
        });

        test('has handleSave as its onClick prop', () => {
          const instance = wrapper.instance();

          expect(button.props().onClick).toBe(instance.handleSave);
        });
      });
    });
  });

  describe('handleSave', () => {
    const comments = 'Some comments';
    const mockEvent = { preventDefault: () => null };

    beforeAll(() => {
      const instance = getWrapper().instance();
      // override ref value to mock
      instance.commentsInput = { value: comments };

      defaultProps.onSave.reset();
      instance.handleSave(mockEvent);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls onSave given in props', () => {
      expect(defaultProps.onSave.callCount).toBe(1);
    });

    test('calls commentReservation with correct arguments', () => {
      const actualArgs = defaultProps.onSave.lastCall.args;

      expect(actualArgs[0]).toEqual(comments);
    });
  });
});
