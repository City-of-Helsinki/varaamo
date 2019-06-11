import MockDate from 'mockdate';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Label from '../../../label';
import Resource from '../../../../utils/fixtures/Resource';
import * as resourceUtils from '../../../../utils/resourceUtils';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceAvailability from '../ResourceAvailability';

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

    test('renders an empty span', () => {
      const wrapper = getWrapper({ date });
      expect(wrapper.equals(<span />)).toBe(true);
    });
  });

  describe('if resource has an external reservation url', () => {
    const resource = Resource.build({
      externalReservationUrl: 'http://test.com',
    });
    const now = '2016-10-10T06:00:00+03:00';
    const date = '2016-10-10';

    beforeEach(() => {
      MockDate.set(now);
    });

    afterEach(() => {
      MockDate.reset();
    });

    test('renders an empty span', () => {
      const wrapper = getWrapper({ date, resource });
      expect(wrapper.equals(<span />)).toBe(true);
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

    test('renders a Label component', () => {
      const label = getWrapper({ date }).find(Label);
      expect(label.length).toBe(1);
    });

    test('uses getAvailabilityDataForNow for Label props', () => {
      const expectedData = { status: 'closed', bsStyle: 'danger' };
      simple.mock(resourceUtils, 'getAvailabilityDataForNow').returnWith(expectedData);
      const label = getWrapper({ date }).find(Label);

      expect(label.prop('bsStyle')).toBe(expectedData.bsStyle);
      expect(label.prop('children')).toBe('ResourceAvailability.closed');
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

    test('renders a Label component', () => {
      const label = getWrapper({ date }).find(Label);
      expect(label.length).toBe(1);
    });

    test('uses getAvailabilityDataForWholeDay for Label props', () => {
      const expectedData = { status: 'closed', bsStyle: 'danger' };
      simple.mock(resourceUtils, 'getAvailabilityDataForWholeDay').returnWith(expectedData);
      const label = getWrapper({ date }).find(Label);

      expect(label.prop('bsStyle')).toBe(expectedData.bsStyle);
      expect(label.prop('children')).toBe('ResourceAvailability.closed');
      simple.restore();
    });
  });
});
