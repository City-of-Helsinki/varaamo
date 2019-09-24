
export const NOTIFICATION_TYPE = {
  ERROR: 'error'
};

export const NOTIFICATION_DEFAULT = {
  message: '',
  type: 'info',
  timeOut: 5000,
  hidden: false,
};

export const NOTIFICATION_ERROR = {
  ...NOTIFICATION_DEFAULT,
  type: NOTIFICATION_TYPE.ERROR
};
