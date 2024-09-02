import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const ReferSlice = createSlice({
  name: "Refer",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setReferData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setReferLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setReferError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateRefer: (state, action) => {
      const updatedRefer = action.payload;
      state.data = state.data.map((Refer) =>
        Refer.team_id === updatedRefer.team_id ? updatedRefer : Refer
      );
    },
    deleteRefer: (state, action) => {
      const selectedBankAccountId = action.payload;
      state.data = state.data.filter(
        (Refer) => Refer.team_id !== selectedBankAccountId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setReferData,
  setReferLoading,
  setReferError,
  updateRefer,
  deleteRefer,
} = ReferSlice.actions;

export const fetchReferData = () => async (dispatch) => {
  try {
    dispatch(setReferLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "refer/getAllRefers"
    );
    dispatch(setReferData(response.data));
  } catch (error) {
    dispatch(setReferError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddReferData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "refer/newRefer",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchReferData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updateReferData = (team_id, formData) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `refer/updateRefer/${team_id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedReferData = response.data;

    dispatch(updateRefer(updatedReferData));
  } catch (error) {
    console.error("Error updating bank account:", error);
  }
};

export const deleteReferData = (team_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `refer/deleteRefer/${team_id}`
    );

    dispatch(deleteRefer(deleteReferData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectReferData = (state) => state.Refer.data;
export const selectReferLoading = (state) => state.Refer.isLoading;
export const selectReferError = (state) => state.Refer.error;

export default ReferSlice.reducer;
