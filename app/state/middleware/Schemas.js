import { arrayOf, Schema } from 'normalizr';

const purposeSchema = new Schema('purposes');
const reservationSchema = new Schema('reservations', { idAttribute: 'url' });
const resourceSchema = new Schema('resources');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedPurposesSchema = new Schema('paginatedPurposes');
const paginatedReservationsSchema = new Schema('paginatedReservations');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedUnitsSchema = new Schema('paginatedUnits');
const typeaheadSchema = new Schema('typeaheadSuggestions');

paginatedPurposesSchema.define({
  results: arrayOf(purposeSchema),
});

paginatedReservationsSchema.define({
  results: arrayOf(reservationSchema),
});

paginatedResourcesSchema.define({
  results: arrayOf(resourceSchema),
});

paginatedUnitsSchema.define({
  results: arrayOf(unitSchema),
});

typeaheadSchema.define({
  resource: arrayOf(resourceSchema),
});

export default {
  paginatedPurposesSchema,
  paginatedReservationsSchema,
  paginatedResourcesSchema,
  paginatedUnitsSchema,
  purposeSchema,
  resourceSchema,
  unitSchema,
};
