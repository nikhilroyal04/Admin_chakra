import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AppSlice = createSlice({
  name: "app",
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setAppData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setAppLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setAppError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setAppData, setAppLoading, setAppError } = AppSlice.actions;

export const fetchAppData = () => async (dispatch) => {
  try {
    dispatch(setAppLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "setting/getSetting"
    );
    dispatch(setAppData(response.data));
  } catch (error) {
    dispatch(setAppError(error.message));
    console.error("Error fetching app data:", error);
  }
};

export const updateAppData = (formData) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + "setting/updateSetting",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedAppData = response.data;

    dispatch(setAppData(updatedAppData));
  } catch (error) {
    console.error("Error updating app data:", error);
    dispatch(setAppError(error.message));
  }
};

export const selectAppData = (state) => state.app.data;
export const selectAppLoading = (state) => state.app.isLoading;
export const selectAppError = (state) => state.app.error;

export default AppSlice.reducer;
