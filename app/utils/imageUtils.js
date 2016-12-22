import find from 'lodash/find';

function getMainImage(images) {
  if (!images || !images.length) {
    return {};
  }

  return find(images, { type: 'main' }) || images[0];
}

export {
  getMainImage,
};
