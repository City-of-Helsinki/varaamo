export const RESERVATION_PHASE = {
  NEW: 'new',
  EDIT: 'edit',
  CONFIRMATION: 'confirmation',
  INFORMATION: 'information',
  COMPLETED: 'completed'
};

// TODO: match phase name and phase in url. For example: confirm instead of confirmation

export const reservationMetadataFields = [
  'billing_address_city',
  'billing_address_street',
  'billing_address_zip',
  'company',
  'event_description',
  'event_description_guidance',
  'event_subject',
  'number_of_participants',
  'reservation_extra_questions',
  'reserver_address_city',
  'reserver_address_street',
  'reserver_address_zip',
  'reserver_email_address',
  'reserver_id',
  'reserver_name',
  'reserver_phone_number'
];
