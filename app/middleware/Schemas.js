import { Schema } from 'normalizr';

const purposeSchema = new Schema('purposes');
const resourceSchema = new Schema('resources');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

export default {
  purposeSchema,
  resourceSchema,
  unitSchema,
};
