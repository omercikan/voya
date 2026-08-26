import { Appointment, AppointmentResponse } from "@/types/appointment";

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
      invalidatesTags: ["Appointment"],
    }),

    getAppointmentMe: builder.query<AppointmentResponse[], void>({
      query: () => ({
        url: "/appointments/me",
        method: "GET",
      }),
      providesTags: ["Appointment"],
    }),

    getAppointments: builder.query<AppointmentResponse[], void>({
      query: () => ({
        url: "/appointments",
        method: "GET",
      }),
      providesTags: ["Appointment"],
    }),

    deleteAppointment: builder.mutation<void, string>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointment"],
    }),

    updateAppointmentStatus: builder.mutation<Appointment, string>({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}?status=CONFIRMED`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointment"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentMeQuery,
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} = appointmentApi;
