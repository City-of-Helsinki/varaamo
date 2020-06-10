import { arrayOf, Schema } from 'normalizr';

const reservationSchema = new Schema('reservations', { idAttribute: 'url' });
const resourceSchema = new Schema('resources');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedReservationsSchema = new Schema('paginatedReservations');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedUnitsSchema = new Schema('paginatedUnits');

paginatedReservationsSchema.define({
  results: arrayOf(reservationSchema),
});

paginatedResourcesSchema.define({
  results: arrayOf(resourceSchema),
});

paginatedUnitsSchema.define({
  results: arrayOf(unitSchema),
});

const batchAddResourceSchema = new Schema('resources', {
  unit: unitSchema,
});
const batchAddReservationSchema = new Schema(
  'reservations',
  { idAttribute: 'url' },
);

batchAddResourceSchema.define({
  unit: unitSchema,
});

batchAddReservationSchema.define({
  resource: batchAddResourceSchema,
});

export default {
  paginatedReservationsSchema,
  paginatedResourcesSchema,
  paginatedUnitsSchema,
  resourceSchema,
  unitSchema,
  batchAddReservationSchema,
};
