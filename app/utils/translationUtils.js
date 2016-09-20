function getName(item, language) {
  return getProperty(item, 'name', language);
}

function getProperty(item, property, language = 'fi') {
  if (item && item[property] && item[property][language]) {
    return item[property][language];
  }
  return '';
}

export {
  getName,
  getProperty,
};
