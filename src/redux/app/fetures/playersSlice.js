import { createSlice } from "@reduxjs/toolkit";

const playersSlice = createSlice({
  name: "playersSlice",
  initialState: {
    players: [],
    isStart: false,
    scoreRecord: {},
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
    addResult: (state, { payload }) => {
      state.scoreRecord[payload.player] = payload.playerResult;
    },
    clearResult: (state) => {
      state.scoreRecord = {};
    },
  },
});

export default playersSlice.reducer;

export const { addPlayers, setStart, addResult, clearResult, setStop } =
  playersSlice.actions;
