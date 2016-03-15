import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Input from 'react-bootstrap/lib/Input';

import PreliminaryReservationForm from 'containers/PreliminaryReservationForm';

describe('Container: PreliminaryReservationForm', () => {
  const props = {};
  const wrapper = shallow(<PreliminaryReservationForm {...props} />);

  it('should render a form', () => {
    const form = wrapper.find('form');
    expect(form.length).to.equal(1);
  });

  describe('form inputs', () => {
    const inputs = wrapper.find(Input);

    it('should render 5 inputs', () => {
      expect(inputs.length).to.equal(5);
    });

    it('should render a text input with label "Nimi*"', () => {
      const nameInput = inputs.at(0);

      expect(nameInput.props().type).to.equal('text');
      expect(nameInput.props().label).to.equal('Nimi*');
    });

    it('should render a email input with label "Sähköposti*"', () => {
      const nameInput = inputs.at(1);

      expect(nameInput.props().type).to.equal('email');
      expect(nameInput.props().label).to.equal('Sähköposti*');
    });

    it('should render a text input with label "Puhelin*"', () => {
      const nameInput = inputs.at(2);

      expect(nameInput.props().type).to.equal('text');
      expect(nameInput.props().label).to.equal('Puhelin*');
    });

    it('should render a textarea input with label "Tilaisuuden kuvaus*"', () => {
      const nameInput = inputs.at(3);

      expect(nameInput.props().type).to.equal('textarea');
      expect(nameInput.props().label).to.equal('Tilaisuuden kuvaus*');
    });

    it('should render a text input with label "Osoite*"', () => {
      const nameInput = inputs.at(4);

      expect(nameInput.props().type).to.equal('text');
      expect(nameInput.props().label).to.equal('Osoite*');
    });
  });
});
