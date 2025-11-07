import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  selectedTrip: null,
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
    setSeatMap: (state, action) => {
      state.seatMap = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.selectedTrip = null;
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
  setSeatMap,
  clearSearch,
} = tripSlice.actions;

export default tripSlice.reducer;
