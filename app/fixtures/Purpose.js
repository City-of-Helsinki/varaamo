import { Factory } from 'rosie';

const Purpose = new Factory()
  .sequence('id', (index) => `p-${index}`)
  .sequence('name', (index) => {
    return { fi: `Purpose-${index}` };
  })
  .attr('parent', 'some-parent');

export default Purpose;
