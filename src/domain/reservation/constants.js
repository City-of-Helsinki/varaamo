// Extracted from Respa Admin, under reservation unit metadata fields
export const RESERVATION_METADATA = [
  'billing_address_city',
  'billing_address_street',
  'billing_address_zip',
  'company',
  'event_description',
  // 'event_description_guidance', <== This is legacy field, wont be used in further development of respa/varaamo
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

export const RESERVATION_SHOWONLY_FILTERS = {
  FAVORITE: 'favorite',
  CAN_MODIFY: 'can_modify'
};

export const RESERVATION_TYPE = {
  NORMAL: 'normal',
  BLOCKED: 'blocked'
};
