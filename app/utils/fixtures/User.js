import { Factory } from 'rosie';

const User = new Factory()
  .sequence('id', index => `u-${index}`)
  .sequence('uuid', index => `uuid-${index}`)
  .sequence('firstName', index => `Luke-${index}`)
  .sequence('lastName', index => `Skywalker-${index}`);

export default User;
