import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import RBFormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import FormControl from './FormControl';

describe('shared/form-fields/FormControl', () => {
  const defaultProps = {
    controlProps: { someProp: 'some', otherProp: 'other' },
    id: 'email',
    label: 'Enter your email',
    type: 'text',
    validationState: 'error',
  };

  function getWrapper(props) {
    return shallow(<FormControl {...defaultProps} {...props} />);
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

  describe('Col components', () => {
    it('renders 2 Col components', () => {
      const cols = getWrapper().find(Col);
      expect(cols.length).to.equal(2);
    });

    describe('the first Col', () => {
      let col;

      before(() => {
        col = getWrapper().find(Col).at(0);
      });

      it('gets correct props', () => {
        expect(col.props().componentClass).to.equal(ControlLabel);
        expect(col.props().sm).to.equal(3);
      });

      it('contains the label text given in props', () => {
        expect(col.props().children).to.equal(defaultProps.label);
      });
    });

    describe('the second Col', () => {
      let col;

      before(() => {
        col = getWrapper().find(Col).at(1);
      });

      it('gets correct props', () => {
        expect(col.props().sm).to.equal(9);
      });

      it('contains React Bootstrap FormControl', () => {
        const rbFormControl = col.find(RBFormControl);
        expect(rbFormControl.length).to.equal(1);
      });
    });
  });

  describe('React Bootstrap FormControl component', () => {
    it('is rendered', () => {
      const rbFormControl = getWrapper().find(RBFormControl);
      expect(rbFormControl.length).to.equal(1);
    });

    describe('when type of the control is "textarea"', () => {
      it('gets correct props', () => {
        const type = 'textarea';
        const actualProps = getWrapper({ type }).find(RBFormControl).props();
        Object.keys(defaultProps.controlProps).forEach((key) => {
          expect(actualProps[key]).to.equal(defaultProps.controlProps[key]);
        });
        expect(actualProps.componentClass).to.equal('textarea');
        expect(actualProps.type).to.equal(undefined);
      });
    });

    describe('when type of the control is anything but "textarea"', () => {
      it('gets correct props', () => {
        const type = 'text';
        const actualProps = getWrapper({ type }).find(RBFormControl).props();
        Object.keys(defaultProps.controlProps).forEach((key) => {
          expect(actualProps[key]).to.equal(defaultProps.controlProps[key]);
        });
        expect(actualProps.type).to.equal(type);
      });
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
