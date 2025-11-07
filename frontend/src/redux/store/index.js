import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tripReducer from './slices/tripSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trip: tripReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
