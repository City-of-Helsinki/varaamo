import { NotificationManager } from 'react-notifications';

import { NOTIFICATION_TYPE } from './constants';

export const createNotification = (type, message = '', title = '', fadeTime = 2000, callback) => {
  switch (type) {
    case NOTIFICATION_TYPE.INFO:
      NotificationManager.info(message, title, fadeTime, callback);
      break;
    case NOTIFICATION_TYPE.SUCCESS:
      NotificationManager.success(message, title, fadeTime, callback);
      break;
    case NOTIFICATION_TYPE.WARNING:
      NotificationManager.warning(message, title, fadeTime, callback);
      break;
    case NOTIFICATION_TYPE.ERROR:
      NotificationManager.error(message, title, fadeTime, callback);
      break;
    default:
      NotificationManager.info(message, title, fadeTime, callback);
  }
};
