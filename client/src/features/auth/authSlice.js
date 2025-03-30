import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const setAuthToken = (token) => {
  if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  else{
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try{
            const { data } = await axios.post('/api/auth/register', userData);
            localStorage.setItem('token', data.token);
            setAuthToken(data.token);
            return { user: data.user, token: data.token };
        }
        catch(err){
            return rejectWithValue(err.response?.data?.error || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const { data } = await axios.post('/api/auth/login', credentials);
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        return { user: data.user, token: data.token }
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Login failed');
      }
    }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try{
      const token = getState().auth.token || localStorage.getItem('token');
      if(!token) return rejectWithValue('No token found');

      setAuthToken(token);
      const { data } = await axios.get('/api/auth/me');
      return { user: data.user, token };
    }
    catch(err){
      localStorage.removeItem('token');
      setAuthToken(null);
      return rejectWithValue(err.response?.data?.error || 'Authentication Failed');
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        status: 'idle',
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            setAuthToken(null);
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
      builder
        .addMatcher(
          [registerUser.pending, loginUser.pending, loadUser.pending],
          (state) => {
            state.status = 'loading';
          }
        )
        .addMatcher(
          [registerUser.fulfilled, loginUser.fulfilled, loadUser.fulfilled],
          (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
          }
        )
        .addMatcher(
          [registerUser.rejected, loginUser.rejected, loadUser.rejected],
          (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
            state.isAuthenticated = false;
          }
        );
    }
});

export const { logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;