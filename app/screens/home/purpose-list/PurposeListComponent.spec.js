import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Immutable from 'seamless-immutable';

import Purpose from 'fixtures/Purpose';
import PurposeListComponent from './PurposeListComponent';
import PurposeListItemComponent from './PurposeListItemComponent';

describe('screens/home/purpose-list/PurposeListItemComponent', () => {
  const defaultProps = {
    purposes: Immutable([
      Purpose.build(),
      Purpose.build(),
    ]),
  };

  function getWrapper(extraProps) {
    return shallow(<PurposeListComponent {...defaultProps} {...extraProps} />);
  }

  describe('PurposeListItem components', () => {
    it('PurposeListItemComponent is rendered for each purpose given in props', () => {
      const purposeListItems = getWrapper().find(PurposeListItemComponent);
      expect(purposeListItems).to.have.length(defaultProps.purposes.length);
    });

    it('correct props are given to every PurposeListItemComponent', () => {
      const purposeListItems = getWrapper().find(PurposeListItemComponent);
      defaultProps.purposes.forEach((purpose, index) => {
        const purposeListItem = purposeListItems.at(index);
        const actualProps = purposeListItem.props();
        expect(actualProps.imageUrl).to.exist;
        expect(actualProps.linkUrl).to.contain(purpose.id);
        expect(actualProps.text).to.equal(purpose.name.fi);
      });
    });
  });
});
