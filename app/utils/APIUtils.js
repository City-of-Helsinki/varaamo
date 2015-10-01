import { camelizeKeys } from 'humps';
import { normalize } from 'normalizr';

export default {
  createTransformFunction,
};

function createTransformFunction(schema) {
  return (json) => {
    const camelizedJson = camelizeKeys(json);
    if (schema) {
      return normalize(camelizedJson, schema);
    }
    return camelizedJson;
  };
}
