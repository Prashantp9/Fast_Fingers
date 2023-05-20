import { createSlice } from "@reduxjs/toolkit";

const playersSlice = createSlice({
  name: "playersSlice",
  initialState: {
    players: [],
    isStart: false,
  },
  reducers: {
    addPlayers: (state, { payload }) => {
      state.players = payload.players;
    },
    setStart: (state, { payload }) => {
      state.isStart = payload.start;
    },
  },
});

export default playersSlice.reducer;

export const { addPlayers, setStart } = playersSlice.actions;
