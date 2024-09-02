import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CategorySlice = createSlice({
  name: "Category",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setCategoryData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setCategoryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCategoryError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      state.data = state.data.map((category) =>
        category.category_id === updatedCategory.category_id ? updatedCategory : category
      );
    },
    deleteCategory: (state, action) => {
      const CategoryIdToDelete = action.payload;
      state.data = state.data.filter((category) => category.category_id !== CategoryIdToDelete);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setCategoryData,
  setCategoryLoading,
  setCategoryError,
  updateCategory,
  deleteCategory,
} = CategorySlice.actions;

export const fetchCategoryData = () => async (dispatch) => {
  try {
    dispatch(setCategoryLoading());
    const response = await axios.get(import.meta.env.VITE_BASE_URL + "client/getGameCategory");
    dispatch(setCategoryData(response.data));
  } catch (error) {
    dispatch(setCategoryError(error.message));
  }
};

export const AddCategoryData = (formData) => async () => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "client/addCategory",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateCategoryData = (category_id, formData) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `client/updateCategory/${category_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const updatedCategoryData = response.data;

    dispatch(updateCategory(updatedCategoryData));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteCategoryData = (category_id) => async (dispatch) => {
  try {
    const response = await axios.delete(
      import.meta.env.VITE_BASE_URL + `client/deleteCategory/${category_id}`
    );

    const deleteCategoryData = response.data;

    dispatch(deleteCategory(deleteCategoryData));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const selectCategoryData = (state) => state.Category.data;
export const selectCategoryLoading = (state) => state.Category.isLoading;
export const selectCategoryError = (state) => state.Category.error;

export default CategorySlice.reducer;
