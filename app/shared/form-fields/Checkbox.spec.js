import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import Checkbox from './Checkbox';

describe('shared/form-fields/Checkbox', () => {
  const defaultProps = {
    controlProps: { someProp: 'some', otherProp: 'other' },
    id: 'email',
    label: 'Enter your email',
    validationState: 'error',
  };

  function getWrapper(props) {
    return shallow(<Checkbox {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    it('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).to.equal(defaultProps.id);
      expect(actualProps.validationState).to.equal(defaultProps.validationState);
    });
  });

  describe('Col component', () => {
    it('is rendered', () => {
      const col = getWrapper().find(Col);
      expect(col.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = getWrapper().find(Col).props();
      expect(actualProps.sm).to.equal(9);
      expect(actualProps.smOffset).to.equal(3);
    });
  });

  describe('React Bootstrap Checkbox component', () => {
    it('is rendered', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = getWrapper().find(RBCheckbox).props();
      Object.keys(defaultProps.controlProps).forEach((key) => {
        expect(actualProps[key]).to.equal(defaultProps.controlProps[key]);
      });
    });

    it('gets the label as its children', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.props().children).to.equal(defaultProps.label);
    });
  });

  describe('HelpBlock component', () => {
    describe('if help is given in props', () => {
      const help = 'some help';

      it('is rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).to.equal(1);
      });

      it('displays the help text given in props', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.props().children).to.equal(help);
      });
    });

    describe('if help is not given in props', () => {
      const help = undefined;

      it('is not rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).to.equal(0);
      });
    });
  });
});
