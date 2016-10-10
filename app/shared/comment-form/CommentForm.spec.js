import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ReactDom from 'react-dom';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import { makeButtonTests } from 'utils/testUtils';
import CommentForm from './CommentForm';

describe('shared/comment-form/CommentForm', () => {
  const defaultProps = {
    defaultValue: 'This is a comment',
    isSaving: false,
    onCancel: simple.stub(),
    onSave: simple.stub(),
  };

  function getWrapper(extraProps = {}) {
    return shallow(<CommentForm {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders a form', () => {
      const form = getWrapper().find('form');

      expect(form.length).to.equal(1);
    });

    describe('comments textarea', () => {
      it('renders a FormControl with correct props', () => {
        const formControl = getWrapper().find(FormControl);

        expect(formControl.length).to.equal(1);
        expect(formControl.prop('componentClass')).to.equal('textarea');
        expect(formControl.prop('defaultValue')).to.equal(defaultProps.defaultValue);
      });
    });

    describe('form buttons', () => {
      const wrapper = getWrapper();
      const buttons = wrapper.find(Button);

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        makeButtonTests(
          buttons.at(0),
          'back',
          'Takaisin',
          defaultProps.onCancel
        );
      });

      describe('the second button', () => {
        const button = buttons.at(1);

        it('is save button', () => {
          expect(button.props().children).to.equal('Tallenna');
        });

        it('has handleSave as its onClick prop', () => {
          const instance = wrapper.instance();

          expect(button.props().onClick).to.equal(instance.handleSave);
        });
      });
    });
  });

  describe('handleSave', () => {
    const comments = 'Some comments';

    before(() => {
      simple.mock(ReactDom, 'findDOMNode').returnWith({ value: comments });
      const instance = getWrapper().instance();
      defaultProps.onSave.reset();
      instance.handleSave();
    });

    after(() => {
      simple.restore();
    });

    it('calls onSave given in props', () => {
      expect(defaultProps.onSave.callCount).to.equal(1);
    });

    it('calls commentReservation with correct arguments', () => {
      const actualArgs = defaultProps.onSave.lastCall.args;

      expect(actualArgs[0]).to.deep.equal(comments);
    });
  });
});
