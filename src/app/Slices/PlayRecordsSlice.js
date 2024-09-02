import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const PlayRecordsSlice = createSlice({
  name: "PlayRecords",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setPlayRecordsData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setPlayRecordsLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setPlayRecordsError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatePlayRecords: (state, action) => {
      const updatedPlayRecords = action.payload;
      state.data = state.data.map((PlayRecords) =>
        PlayRecords.play_record_id === updatedPlayRecords.play_record_id
          ? updatedPlayRecords
          : PlayRecords
      );
    },
    deletePlayRecords: (state, action) => {
      const selectedPlayRecordsId = action.payload;
      state.data = state.data.filter(
        (PlayRecords) => PlayRecords.play_record_id !== selectedPlayRecordsId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setPlayRecordsData,
  setPlayRecordsLoading,
  setPlayRecordsError,
  updatePlayRecords,
  deletePlayRecords,
} = PlayRecordsSlice.actions;

export const fetchPlayRecordsData = () => async (dispatch) => {
  try {
    dispatch(setPlayRecordsLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "wallet/getAllPlayRecords"
    );
    dispatch(setPlayRecordsData(response.data));
  } catch (error) {
    dispatch(setPlayRecordsError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddPlayRecordsData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "wallet/newPlayRecord",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchPlayRecordsData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updatePlayRecordsData =
  (play_record_id, formData) => async (dispatch) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL + `wallet/updatePlayRecord/${play_record_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedPlayRecordsData = response.data;

      dispatch(updatePlayRecords(updatedPlayRecordsData));
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  };

export const deletePlayRecordsData = (play_record_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `wallet/deletePlayRecord/${play_record_id}`
    );

    dispatch(deletePlayRecords(deletePlayRecordsData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectPlayRecordsData = (state) => state.PlayRecords.data;
export const selectPlayRecordsLoading = (state) =>
  state.PlayRecords.isLoading;
export const selectPlayRecordsError = (state) => state.PlayRecords.error;

export default PlayRecordsSlice.reducer;
