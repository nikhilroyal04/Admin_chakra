import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const GameListSlice = createSlice({
  name: "GameList",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setGameListData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setGameListLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setGameListError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGameList: (state, action) => {
      const updatedGameList = action.payload;
      state.data = state.data.map((GameList) =>
        GameList.game_id === updatedGameList.game_id
          ? updatedGameList
          : GameList
      );
    },
    deleteGameList: (state, action) => {
      const GameListIdToDelete = action.payload;
      state.data = state.data.filter(
        (GameList) => GameList.game_id !== GameListIdToDelete
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setGameListData,
  setGameListLoading,
  setGameListError,
  updateGameList,
  deleteGameList,
} = GameListSlice.actions;

export const fetchGameListData = () => async (dispatch) => {
  try {
    dispatch(setGameListLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "client/getAllGames"
    );
    dispatch(setGameListData(response.data));
  } catch (error) {
    dispatch(setGameListError(error.message));
  }
};

export const AddGameListData = (formData) => async () => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "client/addGame",
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

export const updateGameListData = (game_id, updatedGameData) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `client/updateGame/${game_id}`,
      updatedGameData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedGameListData = response.data;

    dispatch(updateGameList(updatedGameListData));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteGameListData = (game_id) => async (dispatch) => {
  try {
    const response = await axios.delete(
      import.meta.env.VITE_BASE_URL + `client/deleteGame/${game_id}`
    );

    const deleteGameListData = response.data;

    dispatch(deleteGameList(deleteGameListData));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const selectGameListData = (state) => state.GameList.data;
export const selectGameListLoading = (state) => state.GameList.isLoading;
export const selectGameListError = (state) => state.GameList.error;

export default GameListSlice.reducer;
