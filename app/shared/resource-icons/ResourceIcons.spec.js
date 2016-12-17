import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceIcons from './ResourceIcons';

describe('shared/resource-list/ResourceIcons', () => {
  const defaultProps = {
    resource: Immutable(Resource.build({
      peopleCapacity: 10,
      maxPeriod: '02:00:00',
      minPricePerHour: '10.00',
      maxPricePerHour: '25.00',
    })),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceIcons {...defaultProps} {...extraProps} />);
  }
  let wrapper;
  let wrapperNoProps;
  before(() => {
    wrapper = getWrapper();
    wrapperNoProps = getWrapper({
      resource: Immutable(Resource.build({
        peopleCapacity: null,
        maxPeriod: null,
        minPricePerHour: null,
        maxPricePerHour: null,
      })),
    });
  });

  it('is rendered', () => {
    expect(wrapper).to.be.defined;
  });

  it('has icons class', () => {
    expect(wrapper.prop('className')).to.equal('resource-icons');
  });

  describe('capacity icon', () => {
    let userIcon;
    let spanText;
    before(() => {
      userIcon = wrapper.find({ glyph: 'user' });
      spanText = userIcon.parent().find('.text');
    });

    it('is rendered', () => {
      expect(userIcon).to.have.length(1);
    });

    it('renders correct text', () => {
      expect(spanText.text()).to.equal('10');
    });

    it('is not rendered if prop is not passed', () => {
      expect(wrapperNoProps.find({ glyph: 'user' })).to.have.length(0);
    });
  });

  describe('time icon', () => {
    let timeIcon;
    let spanText;
    before(() => {
      timeIcon = wrapper.find({ glyph: 'time' });
      spanText = timeIcon.parent().find('.text');
    });

    it('is rendered', () => {
      expect(timeIcon).to.have.length(1);
    });

    it('renders correct text', () => {
      expect(spanText.text()).to.equal('2 h');
    });

    it('is not rendered if prop is not passed', () => {
      expect(wrapperNoProps.find({ glyph: 'time' })).to.have.length(0);
    });
  });

  describe('euro icon', () => {
    let euroIcon;
    let spanText;

    function getSpanTextWithProps(resourceProps) {
      const resource = defaultProps.resource.merge(resourceProps);
      return getWrapper({ resource }).find({ glyph: 'euro' }).parent().find('.text');
    }
    before(() => {
      euroIcon = wrapper.find({ glyph: 'euro' });
      spanText = euroIcon.parent().find('.text');
    });

    it('is rendered', () => {
      expect(euroIcon).to.have.length(1);
    });

    it('renders range of prices', () => {
      expect(spanText.text()).to.equal('10 - 25 €/h');
    });

    it('renders max euro if no min price', () => {
      const props = {
        maxPricePerHour: '25.00',
        minPricePerHour: null,
      };
      expect(getSpanTextWithProps(props).text()).to.equal('25 €/h');
    });

    it('renders min price if no max price', () => {
      const props = {
        maxPricePerHour: '10.00',
        minPricePerHour: null,
      };
      expect(getSpanTextWithProps(props).text()).to.equal('10 €/h');
    });

    it('renders one price if min and max prices are the same', () => {
      const props = {
        maxPricePerHour: '10.00',
        minPricePerHour: '10.00',
      };
      expect(getSpanTextWithProps(props).text()).to.equal('10 €/h');
    });

    it('renders "free" message if price is 0', () => {
      const props = {
        maxPricePerHour: null,
        minPricePerHour: '0.00',
      };
      expect(getSpanTextWithProps(props).text()).to.equal('ResourceIcons.free');
    });

    it('is not rendered if prop is not passed', () => {
      expect(wrapperNoProps.find({ glyph: 'euro' })).to.have.length(0);
    });
  });
});
