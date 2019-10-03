import { Factory } from 'rosie';

import * as fixtureUtils from './utils';

export default new Factory()
  .sequence('id')
  .sequence('name', fixtureUtils.getLocalizedFieldSequenceGeneratorFunction('Purpose'))
  .attr('parent', null);
