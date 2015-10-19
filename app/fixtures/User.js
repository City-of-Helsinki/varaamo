import { Factory } from 'rosie';

const User = new Factory()
  .sequence('id', (index) => `u-${index}`)
  .sequence('name', (index) => `Luke Skywalker-${index}`);

export default User;
