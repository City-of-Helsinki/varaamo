import { Factory } from 'rosie';

const Unit = new Factory()
  .sequence('id', index => `u-${index}`)
  .sequence('name', index => ({ fi: `Unit-${index}` }));

export default Unit;
