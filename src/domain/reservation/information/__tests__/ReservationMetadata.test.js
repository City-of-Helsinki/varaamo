import React from 'react';
import toJson from 'enzyme-to-json';

import ReservationMetadata from '../ReservationMetadata';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import reservationCreator from '../../../../common/data/fixtures/reservation';

describe('ReservationMetadata', () => {
  reservationCreator.attr('reserver_name', 'foo');
  const reservation = reservationCreator.build();

  test('render normally', () => {
    const wrapper = shallowWithIntl(
      <ReservationMetadata reservation={reservation} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('render custom field if specified', () => {
    const customField = (fieldName) => <div key={fieldName}>foo</div>;

    const wrapper = shallowWithIntl(
      <ReservationMetadata
        customField={customField}
        reservation={reservation}
      />
    );

    expect(wrapper).toBeDefined();
  });
});
