import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  appointment: {
    dateStart: "",
    dateEnd: "",
    hourStart: "",
    hourEnd: "",
    vehicleId: "",
    customerId: "",
    purpose: "",
    note: "",
  },
};

export const appointmentSlice = createSlice({
  name: "appointmentSlice",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<"PREV" | "NEXT">) => {
      const payload = action.payload;

      if (state.step >= 5 && payload === "NEXT") return;

      switch (payload) {
        case "NEXT":
          state.step++;
          break;
        case "PREV":
          state.step--;
          break;
      }
    },

    setAppointment: (
      state,
      action: PayloadAction<Partial<(typeof initialState)["appointment"]>>,
    ) => {
      Object.assign(state.appointment, action.payload);
    },
  },
});

export const { setStep, setAppointment } = appointmentSlice.actions;
