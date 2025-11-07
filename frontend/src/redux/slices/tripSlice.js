import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  selectedTrip: null,
  selectedSeats: [],
  seatMap: null,
  loading: false,
  error: null,
  searchParams: {
    originCity: '',
    destinationCity: '',
    departureDate: '',
  },
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    searchTripsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    searchTripsSuccess: (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
      state.error = null;
    },
    searchTripsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
    },
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    setSeatMap: (state, action) => {
      state.seatMap = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.selectedTrip = null;
      state.selectedSeats = [];
      state.seatMap = null;
    },
  },
});

export const {
  setSearchParams,
  searchTripsStart,
  searchTripsSuccess,
  searchTripsFailure,
  setSelectedTrip,
  setSelectedSeats,
  setSeatMap,
  clearSearch,
} = tripSlice.actions;

export default tripSlice.reducer;
