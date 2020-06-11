import { shallow } from 'enzyme';
import React from 'react';
import BootstrapLabel from 'react-bootstrap/lib/Label';

import Label from '../Label';

function getWrapper(props, content = 'Some text') {
  const defaults = {};
  return shallow(
    <Label {...defaults} {...props}>
      {content}
    </Label>
  );
}

describe('shared/label/Label', () => {
  test('renders a div.app-Label', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-Label')).toBe(true);
  });

  test('adds correct className given in the props', () => {
    const className = 'className';
    const wrapper = getWrapper({ className });
    expect(wrapper.prop('className')).toContain('className');
  });

  describe('renders children', () => {
    test('which contain 1 Label from react-bootstrap', () => {
      const wrapper = getWrapper({});
      const labelComponent = wrapper.find(BootstrapLabel);
      expect(labelComponent).toBeDefined();
      expect(labelComponent.length).toEqual(1);
    });
    test('Label component have children props match with children passed from parent', () => {
      const children = <span>Some text inside a span</span>;
      const wrapper = getWrapper({}, children);
      const component = wrapper.find(BootstrapLabel);

      expect(component.prop('children')).toBe(children);
    });

    test('Label component have props match with props passed from parent', () => {
      const wrapper = getWrapper({ foo: 'bar' });
      const component = wrapper.find(BootstrapLabel);

      expect(component.prop('foo')).toBe('bar');
    });

    test('Label bootstrap component have props match with props passed from parent', () => {
      const wrapper = getWrapper({ bsStyle: 'danger' });
      const component = wrapper.find(BootstrapLabel);

      expect(component.prop('bsStyle')).toBe('danger');
    });
  });
});
