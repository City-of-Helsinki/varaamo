import { Factory } from 'rosie';

import * as fixtureUtils from './utils';

export default new Factory()
  .sequence('id')
  .sequence('name', fixtureUtils.getLocalizedFieldSequenceGeneratorFunction('Unit'))
  .attr('location', { type: 'Point', coordinates: [25.01571, 60.249935] })
  .attr('opening_hours_today', {});
