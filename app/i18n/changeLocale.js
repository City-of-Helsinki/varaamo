import moment from 'moment';
import { updateIntl } from 'react-intl-redux';

import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';

const messages = {
  fi: fiMessages,
  en: enMessages,
  sv: svMessages,
};

function changeLocale(language) {
  const locale = language === 'sv' ? 'se' : language;
  moment.locale(`varaamo-${locale}`);
  return updateIntl({
    locale,
    messages: messages[language],
  });
}

export default changeLocale;
