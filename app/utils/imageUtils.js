import find from 'lodash/find';

import { getProperty } from 'utils/translationUtils';

function getCaption(image, language = 'fi') {
  return getProperty(image, 'caption', language);
}

function getMainImage(images) {
  if (!images || !images.length) {
    return {};
  }

  return find(images, { type: 'main' }) || images[0];
}

export {
  getCaption,
  getMainImage,
};
