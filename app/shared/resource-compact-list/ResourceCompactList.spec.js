import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import ResourceCard from '../resource-card';
import { UnconnectedResourceCompactList as ResourceCompactList } from './ResourceCompactList';

describe('shared/resource-list/ResourceCompactList', () => {
  const defaultProps = {
    resourceIds: Immutable(['resource-1', 'resource-2']),
    date: '2017-01-01',
    location: {},
    history: {},
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceCompactList {...defaultProps} {...extraProps} />);
  }

  describe('with resourceIds', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = getWrapper();
    });

    test('renders a div with correct className', () => {
      const div = wrapper.find('div.app-ResourceCompactList');
      expect(div.length).toBe(1);
    });

    test('renders first ResourceCard', () => {
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.length).toBe(1);
      expect(resourceCard.prop('resourceId')).toBe('resource-1');
    });

    test('passes date prop to ResourceCard', () => {
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.length).toBe(1);
      expect(resourceCard.prop('date')).toBe(defaultProps.date);
    });

    test('renders second ResourceCard if resourcePosition is 1', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.length).toBe(1);
      expect(resourceCard.prop('resourceId')).toBe('resource-2');
    });

    test('passes stacked prop to ResourceCard if more than one resource', () => {
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.prop('stacked')).toBe(true);
    });

    test(
      'does not pass stacked prop to ResourceCard if more only one resource',
      () => {
        const resourceCard = getWrapper({ resourceIds: ['resource-1'] }).find(ResourceCard);
        expect(resourceCard.prop('stacked')).toBe(false);
      }
    );

    test('renders left arrow if resourcePosition state is not 0', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const leftArrow = wrapper.find('.app-ResourceCompactList_arrow-left');
      expect(leftArrow.length).toBe(1);
    });

    test('renders left arrow if resourcePosition state is 0', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 0,
      });
      wrapper.update();
      const leftArrow = wrapper.find('.app-ResourceCompactList_arrow-left');
      expect(leftArrow.length).toBe(1);
    });

    test('left arrow has correct onClick prop', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const leftArrow = wrapper.find('.app-ResourceCompactList_arrow-left');
      expect(leftArrow.prop('onClick')).toBe(instance.onPreviousResource);
    });

    test('renders right arrow if resourcePosition state is 0', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 0,
      });
      wrapper.update();
      const rightArrow = wrapper.find('.app-ResourceCompactList_arrow-right');
      expect(rightArrow.length).toBe(1);
    });

    test(
      'renders right arrow if resourcePosition state is last resource position',
      () => {
        const instance = wrapper.instance();
        instance.setState({
          resourcePosition: 1,
        });
        wrapper.update();
        const rightArrow = wrapper.find('.app-ResourceCompactList_arrow-right');
        expect(rightArrow.length).toBe(1);
      }
    );

    test('right arrow has correct onClick prop', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 0,
      });
      wrapper.update();
      const rightArrow = wrapper.find('.app-ResourceCompactList_arrow-right');
      expect(rightArrow.prop('onClick')).toBe(instance.onNextResource);
    });
  });

  describe('componentWillReceiveProps', () => {
    test('sets resourcePosition to 0', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 1,
      });
      instance.componentWillReceiveProps();
      expect(instance.state.resourcePosition).toBe(0);
    });
  });

  describe('onPreviousResource', () => {
    test('decreases resourcePosition by 1', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 1,
      });
      instance.onPreviousResource();
      expect(instance.state.resourcePosition).toBe(0);
    });

    test('loops to last position if position is 0', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 0,
      });
      instance.onPreviousResource();
      expect(instance.state.resourcePosition).toBe(1);
    });
  });

  describe('onNextResource', () => {
    test('decreases resourcePosition by 1', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 0,
      });
      instance.onNextResource();
      expect(instance.state.resourcePosition).toBe(1);
    });

    test('loops to first position if position is last', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 1,
      });
      instance.onNextResource();
      expect(instance.state.resourcePosition).toBe(0);
    });
  });
});
