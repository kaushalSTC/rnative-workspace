import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userSlice } from './slices/userSlice';
import { appSlice } from './slices/appSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  app: appSlice.reducer,
});

export const createStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
