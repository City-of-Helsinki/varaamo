
import storage from 'redux-persist/lib/storage';
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator({})],
};

export default persistConfig;
