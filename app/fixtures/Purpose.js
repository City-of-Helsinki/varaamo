import { Factory } from 'rosie';

const Purpose = new Factory()
  .sequence('id', (index) => `p-${index}`)
  .sequence('name', (index) => {
    return { fi: `Purpose-${index}` };
  })
  .attr('mainType', 'some_main_type');

export default Purpose;
