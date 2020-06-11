import React from 'react';
import { shallow } from 'enzyme';

import TabbableNavItem from '../TabbableNavItem';

describe('<TabbableNavItem />', () => {
  const defaultProps = {};
  const getWrapper = (props) =>
    shallow(<TabbableNavItem {...defaultProps} {...props} />);
  const getTargetableEl = (wrapper) => wrapper.children().first().dive();

  it("should allow for its targetable element's type to be set to either a or button", () => {
    expect(getTargetableEl(getWrapper()).name()).toEqual('a');
    expect(getTargetableEl(getWrapper({ as: 'button' })).name()).toEqual(
      'button'
    );
  });

  it('should render null for other element types than button or a', () => {
    const originalError = global.console.error;
    global.console.error = () => {};

    expect(getWrapper({ as: 'div' }).type()).toEqual(null);

    global.console.error = originalError;
  });

  it('should spread other props than as on targetable element', () => {
    const testChildren = 'Content';

    expect(
      getTargetableEl(getWrapper({ children: testChildren })).prop('children')
    ).toEqual(testChildren);
  });

  describe('when a button', () => {
    it('should set type attribute', () => {
      expect(
        getTargetableEl(getWrapper({ as: 'button' })).prop('type')
      ).toEqual('button');
    });
  });
});
