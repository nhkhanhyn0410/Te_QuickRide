import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBooking: null,
  selectedSeats: [],
  passengers: {},
  pickupPoint: null,
  dropoffPoint: null,
  myBookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    addPassenger: (state, action) => {
      const { seatNumber, passenger } = action.payload;
      state.passengers[seatNumber] = passenger;
    },
    removePassenger: (state, action) => {
      delete state.passengers[action.payload];
    },
    setPickupPoint: (state, action) => {
      state.pickupPoint = action.payload;
    },
    setDropoffPoint: (state, action) => {
      state.dropoffPoint = action.payload;
    },
    createBookingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action) => {
      state.loading = false;
      state.currentBooking = action.payload;
      state.error = null;
    },
    createBookingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
    },
    clearBooking: (state) => {
      state.currentBooking = null;
      state.selectedSeats = [];
      state.passengers = {};
      state.pickupPoint = null;
      state.dropoffPoint = null;
    },
  },
});

export const {
  setSelectedSeats,
  addPassenger,
  removePassenger,
  setPickupPoint,
  setDropoffPoint,
  createBookingStart,
  createBookingSuccess,
  createBookingFailure,
  setMyBookings,
  clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
