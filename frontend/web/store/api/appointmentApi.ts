import { Appointment } from "@/types/appointment";
import { baseApi } from "./baseApi";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointment: builder.mutation<
      { success: boolean; data: Appointment },
      Omit<Appointment, "id" | "status">
    >({
      query: (appointmentData) => ({
        url: "/appointments",
        method: "POST",
        body: appointmentData,
      }),
    }),
  }),
});

export const { useCreateAppointmentMutation } = appointmentApi;
