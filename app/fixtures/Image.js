import { Factory } from 'rosie';

const Image = new Factory()
  .sequence('url', index => `http://api.hel.fi/respa/resource_image/${index}`)
  .attr('type', 'main')
  .sequence('caption', index => ({ fi: `Caption for Image #${index}` }));

export default Image;
