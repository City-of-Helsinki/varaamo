import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import simple from 'simple-mock';

import TermsField from './TermsField';

describe('shared/form-fields/TermsField', () => {
  const defaultProps = {
    input: {},
    label: 'some label',
    labelLink: 'some link label',
    meta: {},
    name: 'terms',
    onClick: () => null,
  };

  function getWrapper(props) {
    return shallow(<TermsField {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    test('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).to.equal(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).to.equal(defaultProps.name);
    });

    test('gets correct props if error', () => {
      const meta = { error: 'some error', touched: true };
      const actualProps = getWrapper({ meta }).find(FormGroup).props();
      expect(actualProps.validationState).to.equal('error');
    });
  });

  describe('Col component', () => {
    test('is rendered', () => {
      const col = getWrapper().find(Col);
      expect(col.length).to.equal(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(Col).props();
      expect(actualProps.sm).to.equal(9);
    });
  });

  describe('React Bootstrap Checkbox component', () => {
    test('is rendered', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.length).to.equal(1);
    });

    test('gets the label as its children', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.props().children).to.contain(defaultProps.label);
    });
  });

  describe('HelpBlock component with link', () => {
    test('is rendered', () => {
      const link = getWrapper().find('.terms-checkbox-field-link');
      expect(link.length).to.equal(1);
    });

    test('displays the help text given in props', () => {
      const link = getWrapper().find('.terms-checkbox-field-link');
      expect(link.props().children).to.equal(defaultProps.labelLink);
    });

    test('onClick calls prop onClick', () => {
      const onClick = simple.mock();
      const link = getWrapper({ onClick }).find('.terms-checkbox-field-link');
      expect(link.length).to.equal(1);
      expect(link.prop('onClick')).to.exist;
      link.prop('onClick')();
      expect(onClick.callCount).to.equal(1);
    });
  });

  describe('HelpBlock component', () => {
    describe('if error', () => {
      const meta = { error: 'some error', touched: true };
      test('is rendered', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.length).to.equal(2);
      });

      test('displays the error text given in props', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.at(1).props().children).to.equal(meta.error);
      });
    });

    describe('if error is not given in props', () => {
      const meta = {};
      test('is not rendered', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.length).to.equal(1);
      });
    });
  });
});
