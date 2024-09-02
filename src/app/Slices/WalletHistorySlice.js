import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const WalletHistorySlice = createSlice({
  name: "WalletHistory",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setWalletHistoryData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setWalletHistoryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setWalletHistoryError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateWalletHistory: (state, action) => {
      const updatedWalletHistory = action.payload;
      state.data = state.data.map((WalletHistory) =>
        WalletHistory.wallet_id === updatedWalletHistory.wallet_id
          ? updatedWalletHistory
          : WalletHistory
      );
    },
    deleteWalletHistory: (state, action) => {
      const selectedBankAccountId = action.payload;
      state.data = state.data.filter(
        (WalletHistory) => WalletHistory.wallet_id !== selectedBankAccountId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setWalletHistoryData,
  setWalletHistoryLoading,
  setWalletHistoryError,
  updateWalletHistory,
  deleteWalletHistory,
} = WalletHistorySlice.actions;

export const fetchWalletHistoryData = () => async (dispatch) => {
  try {
    dispatch(setWalletHistoryLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "wallet/getWalletHistory"
    );
    dispatch(setWalletHistoryData(response.data));
  } catch (error) {
    dispatch(setWalletHistoryError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddWalletHistoryData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "wallet/newWalletHistory",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchWalletHistoryData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updateWalletHistoryData =
  (wallet_id, formData) => async (dispatch) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL +
          `wallet/updateWalletHistory/${wallet_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedWalletHistoryData = response.data;

      dispatch(updateWalletHistory(updatedWalletHistoryData));
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  };

export const deleteWalletHistoryData = (wallet_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `wallet/deleteWalletHistory/${wallet_id}`
    );

    dispatch(deleteWalletHistory(deleteWalletHistoryData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectWalletHistoryData = (state) => state.WalletHistory.data;
export const selectWalletHistoryLoading = (state) =>
  state.WalletHistory.isLoading;
export const selectWalletHistoryError = (state) => state.WalletHistory.error;

export default WalletHistorySlice.reducer;
