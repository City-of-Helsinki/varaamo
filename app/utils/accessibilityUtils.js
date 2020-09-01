import { getFromLocalStorage, storeInLocalStorage } from './localStorageUtils';

const A11Y_LOCAL_STORAGE_KEY = 'varaamo_selectedViewpoints';

export const getSelA11yPref = () => getFromLocalStorage(A11Y_LOCAL_STORAGE_KEY) || [];

export const setSelA11yPref = selectedViewpoints => storeInLocalStorage(A11Y_LOCAL_STORAGE_KEY, selectedViewpoints);
