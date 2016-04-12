export default {
  API_URL: __API_URL__,
  DATE_FORMAT: 'YYYY-MM-DD',
  FEEDBACK_URL: 'http://www.helmet-kirjasto.fi/varaamo-palaute/',
  NOTIFICATION_DEFAULTS: {
    message: '',
    type: 'info',
    timeOut: 5000,
    hidden: false,
  },
  REQUIRED_API_HEADERS: {
    'Accept': 'application/json',
    'Accept-Language': 'fi',
    'Content-Type': 'application/json',
  },
  RESERVATION_FORM_FIELDS: [
    'reserver_name',
    'reserver_email_address',
    'reserver_phone_number',
    'event_description',
    'reserver_address_street',
    'reserver_address_zip',
    'reserver_address_city',
    'company',
    'business_id',
    'billing_address_street',
    'billing_address_zip',
    'billing_address_city',
    'number_of_participants',
  ],
  RESERVATION_STATE_LABELS: {
    cancelled: {
      labelBsStyle: 'default',
      labelText: 'Peruttu',
    },
    confirmed: {
      labelBsStyle: 'success',
      labelText: 'Hyväksytty',
    },
    denied: {
      labelBsStyle: 'danger',
      labelText: 'Hylätty',
    },
    requested: {
      labelBsStyle: 'primary',
      labelText: 'Käsiteltävänä',
    },
  },
  SUPPORTED_SEARCH_FILTERS: {
    date: '',
    people: '',
    purpose: '',
    search: '',
  },
  TIME_FORMAT: 'H:mm',
};
