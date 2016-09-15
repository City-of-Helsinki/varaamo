import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import ResourceList from './ResourceList';
import ResourceListItem from './ResourceListItem';

describe('screens/shared/resource-list/ResourceList', () => {
  const unit = Unit.build();
  const defaultProps = {
    date: '2015-10-10',
    emptyMessage: 'Some empty message',
    resources: Immutable([
      Resource.build({ unit: unit.id }),
      Resource.build({ unit: 'unfetched-unit' }),
    ]),
    units: Immutable({
      [unit.id]: unit,
    }),
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceList {...defaultProps} {...extraProps} />);
  }

  describe('with resources', () => {
    let wrapper;

    before(() => {
      wrapper = getWrapper();
    });

    it('renders a list', () => {
      const list = wrapper.find('ul');
      expect(list.length).to.equal(1);
    });

    it('does not render the empty message', () => {
      const emptyMessage = wrapper.find('p');
      expect(emptyMessage.length).to.equal(0);
    });

    describe('rendering individual resources', () => {
      let resources;

      before(() => {
        resources = wrapper.find(ResourceListItem);
      });

      it('should render a ResourceListItem for every resource in props', () => {
        expect(resources.length).to.equal(defaultProps.resources.length);
      });

      it('should pass correct props to ResourceListItem', () => {
        resources.forEach((resource, index) => {
          expect(resource.props().date).to.equal(defaultProps.date);
          expect(resource.props().resource).to.deep.equal(defaultProps.resources[index]);
        });
      });

      it('should pass unit corresponding to resource.unit as a prop to ResourceListItem', () => {
        expect(resources.at(0).props().unit).to.deep.equal(unit);
      });

      it('should pass empty object as unit prop to ResourceListItem if unit is unfetched', () => {
        expect(resources.at(1).props().unit).to.deep.equal({});
      });
    });
  });

  describe('without resources', () => {
    const resources = [];

    it('does not render a list', () => {
      const list = getWrapper({ resources }).find('ul');
      expect(list.length).to.equal(0);
    });

    describe('empty message', () => {
      it('renders the emptyMessage given in props', () => {
        const emptyMessage = 'Some empty message';
        const message = getWrapper({ emptyMessage, resources }).find('p');
        expect(message.text()).to.equal(emptyMessage);
      });

      it('renders an empty div if no emptyMessage is given in props', () => {
        const emptyMessage = undefined;
        const wrapper = getWrapper({ emptyMessage, resources });
        expect(wrapper.matchesElement(<div />)).to.be.true;
      });
    });
  });
});
