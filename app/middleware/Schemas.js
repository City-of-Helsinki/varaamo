import { arrayOf, Schema } from 'normalizr';

const purposeSchema = new Schema('purposes');
const resourceSchema = new Schema('resources');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedPurposesSchema = new Schema('paginatedPurposes');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedUnitsSchema = new Schema('paginatedUnits');

paginatedPurposesSchema.define({
  results: arrayOf(purposeSchema),
});

paginatedResourcesSchema.define({
  results: arrayOf(resourceSchema),
});

paginatedUnitsSchema.define({
  results: arrayOf(unitSchema),
});

export default {
  paginatedPurposesSchema,
  paginatedResourcesSchema,
  paginatedUnitsSchema,
  purposeSchema,
  resourceSchema,
  unitSchema,
};
