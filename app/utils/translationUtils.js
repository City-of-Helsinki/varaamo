function getProperty(item, property, language = 'fi') {
  if (item && item[property] && item[property][language]) {
    return item[property][language];
  }
  return '';
}

export {
  getProperty,
};
