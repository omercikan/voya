import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  appointment: {
    dateStart: "",
    dateEnd: "",
    hourStart: "",
    hourEnd: "",
    vehicleId: "",
    purpose: "",
    note: "",
    rejectNote: "",
  },
  vehicle: {
    id: null,
    brand: "",
    model: "",
    plate: "",
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

    setVehicle: (
      state,
      action: PayloadAction<Partial<(typeof initialState)["vehicle"]>>,
    ) => {
      Object.assign(state.vehicle, action.payload);
    },

    clearAppointment: (state) => {
      state.appointment = initialState.appointment;
      state.vehicle = initialState.vehicle;
      state.step = 1;
    },

    resetAppointment: () => {
      return initialState;
    },
  },
});

export const {
  setStep,
  setAppointment,
  setVehicle,
  clearAppointment,
  resetAppointment,
} = appointmentSlice.actions;
