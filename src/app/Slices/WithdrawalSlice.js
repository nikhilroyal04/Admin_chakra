import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const WithdrawalSlice = createSlice({
  name: "Withdrawal",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setWithdrawalData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setWithdrawalLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setWithdrawalError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateWithdrawal: (state, action) => {
      const updatedWithdrawal = action.payload;
      state.data = state.data.map((Withdrawal) =>
        Withdrawal.withdrawal_id === updatedWithdrawal.withdrawal_id
          ? updatedWithdrawal
          : Withdrawal
      );
    },
    deleteWithdrawal: (state, action) => {
      const selectedBankAccountId = action.payload;
      state.data = state.data.filter(
        (Withdrawal) => Withdrawal.withdrawal_id !== selectedBankAccountId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setWithdrawalData,
  setWithdrawalLoading,
  setWithdrawalError,
  updateWithdrawal,
  deleteWithdrawal,
} = WithdrawalSlice.actions;

export const fetchWithdrawalData = () => async (dispatch) => {
  try {
    dispatch(setWithdrawalLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "wallet/getAllWithdrawRequest"
    );
    dispatch(setWithdrawalData(response.data));
  } catch (error) {
    dispatch(setWithdrawalError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddWithdrawalData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "wallet/newWithdrawRequest",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchWithdrawalData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updateWithdrawalData =
  (withdrawal_id, formData) => async (dispatch) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL + `wallet/updateWithdrawRequest/${withdrawal_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedWithdrawalData = response.data;

      dispatch(updateWithdrawal(updatedWithdrawalData));
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  };

export const deleteWithdrawalData = (withdrawal_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `wallet/deleteWithdrawRequest/${withdrawal_id}`
    );

    dispatch(deleteWithdrawal(deleteWithdrawalData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectWithdrawalData = (state) => state.Withdrawal.data;
export const selectWithdrawalLoading = (state) =>
  state.Withdrawal.isLoading;
export const selectWithdrawalError = (state) => state.Withdrawal.error;

export default WithdrawalSlice.reducer;
