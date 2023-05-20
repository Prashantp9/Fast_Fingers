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
    setStart: (state) => {
      state.isStart = true;
    },
    setStop: (state) => {
      state.isStart = false;
    },
  },
});

export default playersSlice.reducer;

export const { addPlayers, setStart, setStop } = playersSlice.actions;
