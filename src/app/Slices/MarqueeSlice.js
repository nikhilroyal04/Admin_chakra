import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const MarqueeSlice = createSlice({
  name: "Marquee",
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setMarqueeData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setMarqueeLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setMarqueeError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setMarqueeData, setMarqueeLoading, setMarqueeError } =
  MarqueeSlice.actions;

export const fetchMarqueeData = () => async (dispatch) => {
  try {
    dispatch(setMarqueeLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "marquee/getMarquee"
    );
    dispatch(setMarqueeData(response.data));
  } catch (error) {
    dispatch(setMarqueeError(error.message));
    console.error("Error fetching Marquee data:", error);
  }
};

export const updateMarqueeData = (title) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + "marquee/updateMarquee",
      {title},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedMarqueeData = response.data;

    dispatch(setMarqueeData(updatedMarqueeData));
  } catch (error) {
    console.error("Error updating Marquee data:", error);
    dispatch(setMarqueeError(error.message));
  }
};

export const selectMarqueeData = (state) => state.Marquee.data;
export const selectMarqueeLoading = (state) => state.Marquee.isLoading;
export const selectMarqueeError = (state) => state.Marquee.error;

export default MarqueeSlice.reducer;
