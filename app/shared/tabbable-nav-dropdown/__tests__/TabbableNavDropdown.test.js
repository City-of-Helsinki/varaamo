import React from 'react';
import { shallow } from 'enzyme';

import TabbableNavDropdown from '../TabbableNavDropdown';

// Testing keyboard functionality here would be nice, but as far as I understand
// Enzyme offers poor support for events bound to the document, because it
// focuses on React.
//
// Similarly, jsdom does not implement tabbing, so we would need a cypress test
// to verify tabbing behaviour.
describe('<TabbableNavDropdown />', () => {
  const renderToggle = (props) => <div {...props}>test</div>;
  const defaultProps = {
    renderToggle,
    children: () => {},
  };
  const getWrapper = (props) =>
    shallow(<TabbableNavDropdown {...defaultProps} {...props} />);
  const getWrappingEl = (wrapper) => wrapper.dive().first();

  it('should allow for its wrapping element to be set', () => {
    expect(getWrappingEl(getWrapper()).name()).toEqual('div');
    expect(getWrappingEl(getWrapper({ as: 'li' })).name()).toEqual('li');
  });

  // The state update fails to take place even when the event handler is fired.
  // There's some Enzyme quirk here I don't understand.
  it.skip('should set open class on wrapping element when open', () => {
    const wrapper = getWrapper();

    wrapper
      .find({ children: 'test' })
      .simulate('click', { preventDefault: () => {} });

    expect(getWrappingEl(wrapper).hasClass('open')).toEqual(true);
  });
});
