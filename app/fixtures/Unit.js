import { Factory } from 'rosie';

const Unit = new Factory()
  .sequence('id', (index) => `u-${index}`)
  .sequence('name', (index) => {
    return { fi: `Unit-${index}` };
  });

export default Unit;
