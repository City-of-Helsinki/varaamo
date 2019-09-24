import { NOTIFICATION_ERROR } from '../../constants/NotificationConstant';

export const selectErrorNotification = t => ({
  ...NOTIFICATION_ERROR,
  message: t('Notifications.selectTimeToReserve.warning')
});

export const notLoggedInErrorNotification = t => ({
  ...NOTIFICATION_ERROR,
  message: t('Notifications.loginMessage')
});
