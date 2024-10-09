import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    authData: null,
    userData: null,
  },
  reducers: {
    saveAuthData: (state, action) => {
      state.authData = action.payload;
    },
    saveUserData: (state, action) => {
      state.userData = action.payload;
    },
    resetData: (state, action) => {
      state.userData = null;
      state.authData = null;
    },
    setAccessToken: (state, action) => {
      state.authData = state.authData && {
        ...state.authData,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
  },
});

export const { saveAuthData, saveUserData, resetData, setAccessToken } =
  loginSlice.actions;

export default loginSlice.reducer;
