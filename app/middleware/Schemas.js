import {Schema} from 'normalizr';

const resourceSchema = new Schema('resources');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

export default {
  resourceSchema,
  unitSchema,
};
