import { Factory } from 'rosie';

const Resource = new Factory()
  .sequence('id', index => `r-${index}`)
  .sequence('name', index => `Resource-${index}`)
  .attr('public', true)
  .sequence('unit', index => `u-${index}`)
  .attr('availableHours', [])
  .attr('equipment', [])
  .attr('needManualConfirmation', false)
  .attr('openingHours', [])
  .attr('requiredReservationExtraFields', [])
  .attr('reservable', true)
  .attr('reservableAfter', null)
  .attr('supportedReservationExtraFields', [])
  .attr('userPermissions', { isAdmin: false, canMakeReservations: true });

export const openingHours = [
  {
    opens: '2015-10-10T12:00:00+03:00',
    closes: '2015-10-10T18:00:00+03:00',
  },
  {
    opens: '2015-10-11T10:00:00+03:00',
    closes: '2015-10-11T20:00:00+03:00',
  },
];

export const openingHoursMonth = [
  {
    date: '2015-10-01',
    opens: '2015-10-01T10:00:00+03:00',
    closes: '2015-10-01T15:00:00+03:00',
  },
  {
    date: '2015-10-01',
    opens: '2015-10-01T16:00:00+03:00',
    closes: '2015-10-01T20:00:00+03:00',
  },
  {
    date: '2015-10-10',
    opens: '2015-10-10T12:00:00+03:00',
    closes: '2015-10-10T18:00:00+03:00',
  },
  {
    date: '2015-10-11',
    opens: '2015-10-11T10:00:00+03:00',
    closes: '2015-10-11T20:00:00+03:00',
  },
  {
    date: '2015-10-31',
    opens: '2015-10-31T12:00:00+03:00',
    closes: '2015-10-31T18:00:00+03:00',
  },
  {
    date: '2015-10-30',
    opens: '2015-10-30T19:00:00+03:00',
    closes: '2015-10-30T20:00:00+03:00',
  },
  {
    date: '2015-10-31',
    opens: '2015-10-31T19:00:00+03:00',
    closes: '2015-10-31T20:00:00+03:00',
  },
];

export const availableHours = [
  {
    starts: '2015-10-10T12:00:00+03:00',
    ends: '2015-10-10T13:00:00+03:00',
  },
  {
    starts: '2015-10-10T15:00:00+03:00',
    ends: '2015-10-10T18:00:00+03:00',
  },
];

export default Resource;
