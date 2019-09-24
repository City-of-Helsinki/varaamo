import { NOTIFICATION_DEFAULT, NOTIFICATION_TYPE } from '../../constants/NotificationConstant';

export const minPeriodErrorNotification = t => ({
  ...NOTIFICATION_DEFAULT,
  type: NOTIFICATION_TYPE.ERROR,
  message: t('foo')
});

export const selectErrorNotification = t => ({
  ...NOTIFICATION_DEFAULT,
  type: NOTIFICATION_TYPE.ERROR,
  message: t('foo')
});
