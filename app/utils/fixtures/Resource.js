import { Factory } from 'rosie';

const Resource = new Factory()
  .sequence('id', index => `r-${index}`)
  .sequence('name', index => ({ fi: `Resource-${index}` }))
  .attr('public', true)
  .sequence('unit', index => `u-${index}`)
  .attr('needManualConfirmation', false)
  .attr('reservable', true)
  .attr('userPermissions', { isAdmin: false, canMakeReservations: true })
  .attr('requiredReservationExtraFields', []);

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

export default Resource;
