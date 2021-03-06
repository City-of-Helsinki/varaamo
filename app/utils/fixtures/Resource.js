import { Factory } from 'rosie';

import { DEFAULT_SLOT_SIZE } from '../../constants/SlotConstants';

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
  .attr('userPermissions', { isAdmin: false, canMakeReservations: true })
  .attr('isFavorite', false)
  .attr('slotSize', DEFAULT_SLOT_SIZE)
  .attr('products', []);
export default Resource;
