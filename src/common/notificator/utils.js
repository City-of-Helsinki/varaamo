import moment from 'moment';

/**
 * createSelectOptions()
 * Create option arrays for selects.
 * @returns {Object} with select option arrays
 */
export const createSelectOptions = () => {
  const targetOptions = [
    { value: 'staff', label: 'Staff' },
    { value: 'user', label: 'User' },
    { value: 'all', label: 'All' }
  ];
  const urgencyOptions = [
    { value: 'common', label: 'Common' },
    { value: 'warning', label: 'Warning' },
    { value: 'danger', label: 'Danger' }
  ];
  const activeOptions = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  return {
    targetOptions,
    urgencyOptions,
    activeOptions
  };
};


/**
 * formatValuesForUse()
 * Format notification values to usable form.
 * @returns {Object} with formatted values
 */
export const formatValuesForUse = (notification) => {
  const { targetOptions, urgencyOptions, activeOptions } = createSelectOptions();
  const formattedNotification = { ...notification };
  formattedNotification.target = targetOptions.find(option => option.value === notification.target);
  formattedNotification.urgency = urgencyOptions.find(option => option.value === notification.urgency);
  formattedNotification.active = activeOptions.find(option => option.value === notification.active);
  formattedNotification.until = moment(notification.until).toDate();
  return formattedNotification;
};

/**
 * formatValuesForDatabase()
 * Format notification values to savable form.
 * @returns {Object} with formatted values
 */
export const formatValuesForDatabase = (notification) => {
  const formattedNotification = { ...notification };
  formattedNotification.target = notification.target.value;
  formattedNotification.urgency = notification.urgency.value;
  formattedNotification.active = notification.active.value;
  formattedNotification.until = moment(notification.until).format('YYYYMMDDTHHmmss');
  return formattedNotification;
};
