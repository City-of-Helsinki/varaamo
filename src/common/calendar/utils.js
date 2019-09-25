export const getDefaultSelectedTimeRange = (reservation) => {
  return reservation ? {
    start: reservation.begin,
    end: reservation.end
  } : null;
};
