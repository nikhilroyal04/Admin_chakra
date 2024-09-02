import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const UpiSlice = createSlice({
  name: "Upi",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setUpiData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setUpiLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUpiError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUpi: (state, action) => {
      const updatedUpi = action.payload;
      state.data = state.data.map((Upi) =>
        Upi.bank_id === updatedUpi.bank_id ? updatedUpi : Upi
      );
    },
    deleteUpi: (state, action) => {
      const selectedUpiId = action.payload;
      state.data = state.data.filter(
        (Upi) => Upi.bank_id !== selectedUpiId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUpiData, setUpiLoading, setUpiError, updateUpi, deleteUpi } =
  UpiSlice.actions;

export const fetchUpiData = () => async (dispatch) => {
  try {
    dispatch(setUpiLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "admin/getUpis"
    );
    dispatch(setUpiData(response.data));
  } catch (error) {
    dispatch(setUpiError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddUpiData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "admin/addUpi",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchUpiData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updateUpiData = (upi_id, formData) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `admin/updateUpi/${upi_id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedUpiData = response.data;

    dispatch(updateUpi(updatedUpiData));
  } catch (error) {
    console.error("Error updating bank account:", error);
  }
};

export const deleteUpiData = (upi_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `admin/deleteUpi/${upi_id}`
    );

    dispatch(deleteUpi(deleteUpiData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectUpiData = (state) => state.Upi.data;
export const selectUpiLoading = (state) => state.Upi.isLoading;
export const selectUpiError = (state) => state.Upi.error;

export default UpiSlice.reducer;
