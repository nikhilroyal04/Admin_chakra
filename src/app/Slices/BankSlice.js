import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const Bank_AccountSlice = createSlice({
  name: "Bank_Account",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setBank_AccountData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setBank_AccountLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setBank_AccountError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateBank_Account: (state, action) => {
      const updatedBank_Account = action.payload;
      state.data = state.data.map((Bank_Account) =>
        Bank_Account.bank_id === updatedBank_Account.bank_id
          ? updatedBank_Account
          : Bank_Account
      );
    },
    deleteBank_Account: (state, action) => {
      const selectedBankAccountId = action.payload;
      state.data = state.data.filter(
        (Bank_Account) => Bank_Account.bank_id !== selectedBankAccountId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setBank_AccountData,
  setBank_AccountLoading,
  setBank_AccountError,
  updateBank_Account,
  deleteBank_Account,
} = Bank_AccountSlice.actions;

export const fetchBank_AccountData = () => async (dispatch) => {
  try {
    dispatch(setBank_AccountLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "accounts/getAllBankAccounts"
    );
    dispatch(setBank_AccountData(response.data));
  } catch (error) {
    dispatch(setBank_AccountError(error.message));
    console.error("Error fetching bank account data:", error);
  }
};

export const AddBank_AccountData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "accounts/addBankAccount",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchBank_AccountData());
  } catch (error) {
    console.error("Error adding bank account:", error);
  }
};

export const updateBank_AccountData =
  (bank_id, formData) => async (dispatch) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_URL + `accounts/updateBankAccount/${bank_id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedBank_AccountData = response.data;

      dispatch(updateBank_Account(updatedBank_AccountData));
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  };

export const deleteBank_AccountData = (bank_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `accounts/deleteBankAccount/${bank_id}`
    );

    dispatch(deleteBank_Account(deleteBank_AccountData));
  } catch (error) {
    console.error("Error deleting bank account:", error);
  }
};

export const selectBank_AccountData = (state) => state.Bank_Account.data;
export const selectBank_AccountLoading = (state) =>
  state.Bank_Account.isLoading;
export const selectBank_AccountError = (state) => state.Bank_Account.error;

export default Bank_AccountSlice.reducer;
