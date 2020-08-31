export const storeInLocalStorage = (key, value) => {
  const stringifiedValue = typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key, stringifiedValue);
};

export const getFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};
