import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import ReservationFormControls from 'components/reservation/ReservationFormControls';

describe('Component: reservation/ReservationFormControls', () => {
  const props = {
    disabled: false,
    isMakingReservations: false,
    onClick: simple.stub(),
  };

  const tree = sd.shallowRender(<ReservationFormControls {...props} />);

  it('should render a Button component', () => {
    expect(tree.subTree('Button')).to.be.ok;
  });

  it('should pass correct props to Button component', () => {
    const actualProps = tree.subTree('Button').props;

    expect(actualProps.disabled).to.equal(props.disabled);
    expect(actualProps.onClick).to.equal(props.onClick);
  });

  it('the button should have text "Varaa"', () => {
    expect(tree.subTree('Button').props.children).to.equal('Varaa');
  });
});
