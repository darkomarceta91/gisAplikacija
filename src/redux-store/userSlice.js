import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../axios/api-interceptor";
import { isExpired } from "react-jwt";

function isValidToken(token) {
  return !isExpired(token);
}

const userToken = localStorage.getItem("jwt");

export const loginUser = createAsyncThunk(
  "/users/login/",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("/users/login/", data);
      localStorage.setItem("jwt", response.data.access);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

////USER STATUS
export const userStatus = createAsyncThunk(
  "/users/user_status/",
  async (thunkAPI) => {
    try {
      const response = await api.get("/users/user_status/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      const response = api.put("users/password_change/", data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userName: null,
  user: null,
  token: userToken,
  passwordChanged: false,
  isLoading: false,
  isGuest: true,
  loginError: null,
  statusError: null,
  passError: null,
  isLoggedIn: !!userToken && isValidToken(userToken),
  isModalOpen: false,
  status: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem("jwt");
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setIsModalOpen(state) {
      state.isModalOpen = !state.isModalOpen;
    },
    setTemporaryLayer(state, action) {
      state.temporaryLayer = action.payload;
    },
    setIsTempButtonClicked(state) {
      state.isTempButtonClicked = !state.isTempButtonClicked;
    },
    resetPasswordChanged: (state) => {
      state.passwordChanged = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access;
        state.loginError = null;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.loginError = action.payload;
        state.isLoggedIn = false;
      })
      .addCase(userStatus.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(userStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.username;
      })
      .addCase(userStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.statusError = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.passwordChanged = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.passwordChanged = false;
        state.passError = action.payload;
      });
  },
});

export const {
  logout, 
  setIsModalOpen,
  setTemporaryLayer,
  setIsTempButtonClicked,
  resetPasswordChanged,
} = userSlice.actions;

export default userSlice.reducer;
