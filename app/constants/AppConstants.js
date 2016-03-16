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
  RESERVATION_STATUS_LABELS: {
    accepted: {
      labelBsStyle: 'success',
      labelText: 'Hyväksytty',
    },
    canceled: {
      labelBsStyle: 'default',
      labelText: 'Peruttu',
    },
    declined: {
      labelBsStyle: 'danger',
      labelText: 'Hylätty',
    },
    pending: {
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
