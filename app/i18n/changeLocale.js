import moment from 'moment';
import { updateIntl } from 'react-intl-redux';

import fiMessages from 'i18n/messages/fi.json';

const messages = {
  fi: fiMessages,
  en: fiMessages,
  sv: fiMessages,
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
