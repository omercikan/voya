import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  activeLink: "/dashboard",
};

export const linkSlice = createSlice({
  name: "linkSlice",
  initialState,
  reducers: {
    setActiveLink: (state, action: PayloadAction<string>) => {
      state.activeLink = action.payload;
    },

    resetLink: () => {
      return initialState;
    },
  },
});

export const { setActiveLink, resetLink } = linkSlice.actions;
