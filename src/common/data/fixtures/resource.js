import { Factory } from 'rosie';

import { DEFAULT_SLOT_SIZE } from '../../../../app/constants/SlotConstants';
import * as fixtureUtils from './utils';

export default new Factory()
  .sequence('id')
  .sequence(
    'name',
    fixtureUtils.getLocalizedFieldSequenceGeneratorFunction('Resource')
  )
  .attr('public', true)
  .sequence('unit')
  .attr('available_hours', [])
  .attr('equipment', [])
  .attr('need_manual_confirmation', false)
  .attr('opening_hours', [])
  .attr('required_reservation_extra_fields', [])
  .attr('reservable', true)
  .attr('reservable_after', null)
  .attr('supported_reservation_extra_fields', [])
  .attr('user_permissions', { isAdmin: false, canMakeReservations: true })
  .attr('is_favorite', false)
  .attr('slot_size', DEFAULT_SLOT_SIZE)
  .attr('products', []);
