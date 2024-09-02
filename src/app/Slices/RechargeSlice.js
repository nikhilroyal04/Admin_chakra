import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const RechargeSlice = createSlice({
  name: "Recharge",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setRechargeData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setRechargeLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setRechargeError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateRecharge: (state, action) => {
      const updatedRecharge = action.payload;
      state.data = state.data.map((Recharge) =>
        Recharge.recharge_id === updatedRecharge.recharge_id
          ? updatedRecharge
          : Recharge
      );
    },
    deleteRecharge: (state, action) => {
      const selectedBankAccountId = action.payload;
      state.data = state.data.filter(
        (Recharge) => Recharge.recharge_id !== selectedBankAccountId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setRechargeData,
  setRechargeLoading,
  setRechargeError,
  updateRecharge,
  deleteRecharge,
} = RechargeSlice.actions;

export const fetchRechargeData = () => async (dispatch) => {
  try {
    dispatch(setRechargeLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "wallet/getAllRechargeRequest"
    );
    dispatch(setRechargeData(response.data));
  } catch (error) {
    dispatch(setRechargeError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddRechargeData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "wallet/newRechargeRequest",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchRechargeData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updateRechargeData =
  (recharge_id, formData) => async (dispatch) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL +
          `wallet/updateRechargeRequest/${recharge_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedRechargeData = response.data;

      dispatch(updateRecharge(updatedRechargeData));
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  };

export const deleteRechargeData = (recharge_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL +
        `wallet/deleteRechargeRequest/${recharge_id}`
    );

    dispatch(deleteRecharge(deleteRechargeData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectRechargeData = (state) => state.Recharge.data;
export const selectRechargeLoading = (state) => state.Recharge.isLoading;
export const selectRechargeError = (state) => state.Recharge.error;

export default RechargeSlice.reducer;
