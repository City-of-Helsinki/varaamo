import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import Purpose from 'utils/fixtures/Purpose';
import PurposeList from './PurposeList';
import PurposeListItem from './PurposeListItem';

describe('pages/home/purpose-list/PurposeListItem', () => {
  const defaultProps = {
    purposes: Immutable([
      Purpose.build(),
      Purpose.build(),
    ]),
  };

  function getWrapper(extraProps) {
    return shallow(<PurposeList {...defaultProps} {...extraProps} />);
  }

  describe('PurposeListItem components', () => {
    it('PurposeListItem is rendered for each purpose given in props', () => {
      const purposeListItems = getWrapper().find(PurposeListItem);
      expect(purposeListItems).to.have.length(defaultProps.purposes.length);
    });

    it('correct props are given to every PurposeListItem', () => {
      const purposeListItems = getWrapper().find(PurposeListItem);
      defaultProps.purposes.forEach((purpose, index) => {
        const purposeListItem = purposeListItems.at(index);
        const actualProps = purposeListItem.props();
        expect(actualProps.imageUrl).to.exist;
        expect(actualProps.linkUrl).to.contain(purpose.id);
        expect(actualProps.text).to.equal(purpose.name);
      });
    });
  });
});
