import { Factory } from 'rosie';

const Unit = new Factory()
  .sequence('id', index => `u-${index}`)
  .sequence('name', index => `Unit-${index}`);

export default Unit;
