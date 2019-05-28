import { shallow } from 'enzyme';
import React from 'react';

import ResourceCardInfoCell from './ResourceCardInfoCell';
import iconMap from '../../../assets/icons/map.svg';

describe('/shared/resource-card/info/ResourceCardInfoCell', () => {
  const defaultProps = {
    className: 'app-ResourceCard__info-cell',
    alt: 'foo',
    icon: 'bar',
    onClick: () => {}
  };

  function getWrapper(props) {
    return shallow(<ResourceCardInfoCell {...defaultProps} {...props} />);
  }

  test('render normally', () => {
    const wrapper = getWrapper();
    expect(wrapper).toHaveLength(1);
    expect(wrapper).toBeDefined();
  });

  test('contains default className, joined with passed className prop', () => {
    const wrapper = getWrapper({ className: 'foo' });
    const classnames = wrapper.prop('className');
    expect(classnames).toContain(defaultProps.className);
    expect(classnames).toContain('foo');
  });

  test('contain onClick handler', () => {
    const mockFunc = jest.fn();
    const wrapper = getWrapper({ onClick: mockFunc });

    wrapper.simulate('click');
    expect(mockFunc).toBeCalled();
    expect(wrapper.prop('onClick')).toBeDefined();
    expect(mockFunc.mock.calls.length).toBe(1);
  });

  test('contains img with props', () => {
    const wrapper = getWrapper();
    const img = wrapper.find('img');

    expect(img.prop('alt')).toBe(defaultProps.alt);
    expect(img.prop('src')).toBe(defaultProps.icon);
    expect(img.prop('className')).toBe('app-ResourceCard__info-cell__icon');
  });

  test('accept external icon', () => {
    const wrapper = getWrapper({ icon: iconMap });
    const img = wrapper.find('img');

    expect(img.prop('src')).toBe(iconMap);
  });

  test('accept children as label', () => {
    const label = <span>This is label</span>;
    const wrapper = getWrapper({ children: label });

    expect(wrapper.contains(label)).toBeTruthy();
  });
});
