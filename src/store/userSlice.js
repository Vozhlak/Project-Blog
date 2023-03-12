import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_API = 'https://blog.kata.academy/api';

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async ({ username, email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${BASE_API}/users`, {
        user: {
          username,
          email,
          password
        }
      });

      if (response.status === 200) {
        return dispatch(setUser(response.data));
      }

      return rejectWithValue(response);
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${BASE_API}/users/login`, {
        user: {
          email,
          password
        }
      });

      if (response.status === 200) {
        return dispatch(setUser(response.data));
      }
      return rejectWithValue(response);
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const auth = createAsyncThunk('users/auth', async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.get(`${BASE_API}/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    if (response.status === 200) {
      return dispatch(setUser(response.data));
    }

    return rejectWithValue(response);
  } catch (e) {
    return rejectWithValue(e.response.data);
  }
});

export const updateProfile = createAsyncThunk('users/updateProfile', async (data, { rejectWithValue, dispatch }) => {
  const { username, email, newPassword, avatarImg } = data;
  try {
    const response = await axios.put(
      `${BASE_API}/user`,
      {
        user: {
          username,
          email,
          password: newPassword,
          image: avatarImg
        }
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );

    if (response.status === 200) {
      return dispatch(updateUser(response.data));
    }
    return rejectWithValue(response);
  } catch (e) {
    return rejectWithValue(e.response.data);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    user: {
      username: localStorage.getItem('username') || '',
      email: '',
      image: ''
    },
    status: '',
    isAuth: !!localStorage.getItem('token'),
    error: {
      isError: false,
      errorsValue: null
    }
  },
  reducers: {
    clearStatusAndErrors: (state) => {
      state.status = '';
      state.error.isError = false;
      state.error.errorsValue = null;
    },
    setUser: (state, action) => {
      const { token, ...userData } = action.payload.user;
      localStorage.setItem('token', token);
      localStorage.setItem('username', userData.username);
      state.user = userData;
      state.isAuth = true;
    },
    updateUser: (state, action) => {
      const { token, ...userData } = action.payload.user;
      localStorage.setItem('username', userData.username);
      state.user = userData;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      state.user = {};
      state.isAuth = false;
      state.status = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, () => {})
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(registerUser.rejected, (state, action) => {
        const { errors } = action.payload;
        state.error.isError = true;
        state.error.errorsValue = errors;
        state.status = 'failed';
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.status = '';
        state.error.isError = false;
        state.error.errorsValue = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(loginUser.rejected, (state, action) => {
        const { errors } = action.payload;
        state.error.isError = true;
        state.error.errorsValue = errors;
        state.status = 'failed';
      });

    builder
      .addCase(auth.pending, () => {})
      .addCase(auth.fulfilled, (state) => {
        state.status = '';
      })
      .addCase(auth.rejected, (state, action) => {
        const { errors } = action.payload;
        state.error.isError = true;
        state.error.errorsValue = errors;
        state.status = 'failed';
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = '';
        state.error.isError = false;
        state.error.errorsValue = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        const { errors } = action.payload;
        state.error.isError = true;
        state.error.errorsValue = errors;
        state.status = 'failed';
      });
  }
});

export const { setUser, updateUser, logout, clearStatusAndErrors } = userSlice.actions;
export default userSlice.reducer;
