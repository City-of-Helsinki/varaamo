import { NotificationManager } from 'react-notifications';

import { NOTIFICATION_TYPE } from './constants';
/**
 * createNotification()
 * Creating notification popups
 *
 * @param {string} type
 * @param {string} [message='']
 * @param {string} [title='']
 * @param {number} [fadeTime=2000]
 * @param {function} callback
 * @returns {void}
 */
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
