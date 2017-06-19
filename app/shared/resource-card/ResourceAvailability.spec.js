import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';
import Label from 'react-bootstrap/lib/Label';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import * as resourceUtils from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceAvailability from './ResourceAvailability';

describe('shared/resource-list/ResourceAvailability', () => {
  const defaultProps = {
    date: '2015-10-10',
    resource: Immutable(Resource.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourceAvailability {...defaultProps} {...extraProps} />);
  }

  describe('if date given in props is in the past', () => {
    const now = '2016-10-10T06:00:00+03:00';
    const date = '2016-10-09';

    beforeEach(() => {
      MockDate.set(now);
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('renders an empty span', () => {
      const wrapper = getWrapper({ date });
      expect(wrapper.equals(<span />)).to.be.true;
    });
  });

  describe('if date given in props is the current date', () => {
    const now = '2016-10-10T06:00:00+03:00';
    const date = '2016-10-10';

    beforeEach(() => {
      MockDate.set(now);
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('renders a Label component', () => {
      const label = getWrapper({ date }).find(Label);
      expect(label.length).to.equal(1);
    });

    it('uses getAvailabilityDataForNow for Label props', () => {
      const expectedData = { status: 'closed', bsStyle: 'danger' };
      simple.mock(resourceUtils, 'getAvailabilityDataForNow').returnWith(expectedData);
      const label = getWrapper({ date }).find(Label);

      expect(label.prop('bsStyle')).to.equal(expectedData.bsStyle);
      expect(label.prop('children')).to.equal('ResourceAvailability.closed');
      simple.restore();
    });
  });

  describe('if date given in props is in the future', () => {
    const now = '2016-10-10T06:00:00+03:00';
    const date = '2016-10-11';

    beforeEach(() => {
      MockDate.set(now);
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('renders a Label component', () => {
      const label = getWrapper({ date }).find(Label);
      expect(label.length).to.equal(1);
    });

    it('uses getAvailabilityDataForWholeDay for Label props', () => {
      const expectedData = { status: 'closed', bsStyle: 'danger' };
      simple.mock(resourceUtils, 'getAvailabilityDataForWholeDay').returnWith(expectedData);
      const label = getWrapper({ date }).find(Label);

      expect(label.prop('bsStyle')).to.equal(expectedData.bsStyle);
      expect(label.prop('children')).to.equal('ResourceAvailability.closed');
      simple.restore();
    });
  });
});
