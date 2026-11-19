import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/authApi.js";
import { getApiErrorMessage } from "../../api.js";

export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.me();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("");
      }
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (details, { rejectWithValue }) => {
    try {
      const response = await authApi.register(details);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: getApiErrorMessage(error),
        fieldErrors: error.response?.data?.errors || {},
      });
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: getApiErrorMessage(error),
        fieldErrors: error.response?.data?.errors || {},
      });
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: true,
    submitting: false,
    error: "",
    fieldErrors: {},
  },
  reducers: {
    clearAuthError(state) {
      state.error = "";
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = "";
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload || "";
      })
      .addCase(registerUser.pending, (state) => {
        state.submitting = true;
        state.error = "";
        state.fieldErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || "Registration failed.";
        state.fieldErrors = action.payload?.fieldErrors || {};
      })
      .addCase(loginUser.pending, (state) => {
        state.submitting = true;
        state.error = "";
        state.fieldErrors = {};
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || "Sign-in failed.";
        state.fieldErrors = action.payload?.fieldErrors || {};
      })
      .addCase(logoutUser.pending, (state) => {
        state.submitting = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.submitting = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Sign-out failed.";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
