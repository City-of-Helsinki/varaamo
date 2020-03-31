import { getSlots } from '../resourceKeyboardSlotPickerUtils';

describe('resourcePageKeyboardTimPickerUtils', () => {
  describe('getSlots', () => {
    it('should correctly return an array of slots', () => {
      const opens = new Date(2017, 6, 7, 11, 0, 0, 0).toJSON();
      const closes = new Date(2017, 6, 7, 12, 0, 0, 0).toJSON();
      const slotSize = '00:30';

      expect(getSlots(opens, closes, slotSize)).toEqual([
        {
          start: new Date(2017, 6, 7, 11, 0, 0, 0).toJSON(),
          end: new Date(2017, 6, 7, 11, 29, 59, 999).toJSON(),
        },
        {
          start: new Date(2017, 6, 7, 11, 30, 0, 0).toJSON(),
          end: new Date(2017, 6, 7, 11, 59, 59, 999).toJSON(),
        },
      ]);
    });
  });
});
