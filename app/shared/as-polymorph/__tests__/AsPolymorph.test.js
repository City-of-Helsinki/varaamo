import React from 'react';
import { shallow } from 'enzyme';

import AsPolymorph from '../AsPolymorph';

describe('<AsPolymorph />', () => {
  const defaultProps = {};
  const getWrapper = (props) =>
    shallow(<AsPolymorph {...defaultProps} {...props} />);
  const getWrappingEl = (wrapper) => wrapper;

  it('should render a div by default', () => {
    expect(getWrappingEl(getWrapper()).name()).toEqual('div');
  });

  it('should render an element type based on its as prop', () => {
    expect(getWrappingEl(getWrapper({ as: 'li' })).name()).toEqual('li');
    expect(getWrappingEl(getWrapper({ as: 'button' })).name()).toEqual(
      'button'
    );
    expect(getWrappingEl(getWrapper({ as: 'h1' })).name()).toEqual('h1');
  });
});
