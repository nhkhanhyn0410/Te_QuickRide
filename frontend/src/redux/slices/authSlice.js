import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Load from localStorage
const storedAuth = localStorage.getItem('auth');
if (storedAuth) {
  try {
    const parsed = JSON.parse(storedAuth);
    initialState.user = parsed.user;
    initialState.tokens = parsed.tokens;
    initialState.isAuthenticated = true;
  } catch (error) {
    localStorage.removeItem('auth');
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: action.payload.user,
        tokens: action.payload.tokens,
      }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('auth');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };

      // Update localStorage
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        parsed.user = state.user;
        localStorage.setItem('auth', JSON.stringify(parsed));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
