import React from 'react';

import UnpublishedLabel from './UnpublishedLabel';
import { shallowWithIntl } from 'utils/testUtils';

function getWrapper() {
  return shallowWithIntl(<UnpublishedLabel />);
}

describe('UnpublishedLabel', () => {
  test('render normally', () => {
    const wrapper = getWrapper();

    expect(wrapper).toBeDefined();
    expect(wrapper.length).toEqual(1);
  });

  test('render default props', () => {
    const wrapper = getWrapper();
    expect(wrapper.prop('bsStyle')).toEqual('default');
    expect(wrapper.prop('className')).toEqual('unpublished-label');
  });

  test('render children', () => {
    const wrapper = getWrapper();
    const expected = 'ResourceInfoContainer.unpublishedLabel';

    expect(wrapper.prop('children')).toBeDefined();
    expect(wrapper.prop('children')).toEqual(expected);
  });
});
