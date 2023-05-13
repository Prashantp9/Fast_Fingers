import { createSlice } from "@reduxjs/toolkit";

const playersSlice = createSlice({
  name: "playersSlice",
  initialState: {
    players: [],
  },
  reducers: {
    addPlayers: (state, { payload }) => {
      state.players = payload.players;
    },
  },
});

export default playersSlice.reducer;

export const { addPlayers } = playersSlice.actions;
