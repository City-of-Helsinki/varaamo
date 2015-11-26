export default {
  API_URL: 'https://api.hel.fi/respa/v1',
  DATE_FORMAT: 'YYYY-MM-DD',
  FEEDBACK_URL: 'http://www.helmet-kirjasto.fi/respa-palaute/',
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
  SUPPORTED_SEARCH_FILTERS: {
    date: '',
    people: '',
    purpose: '',
    search: '',
  },
  TIME_FORMAT: 'H:mm',
};
