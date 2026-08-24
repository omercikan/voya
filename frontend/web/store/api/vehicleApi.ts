import { Vehicle, VehicleStatus } from "@/types/vehicle";
import { baseApi } from "./baseApi";

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<Vehicle[], void>({
      query: () => ({
        url: "/api/vehicles",
        method: "GET",
      }),
      providesTags: ["Vehicle"],
    }),

    createVehicle: builder.mutation<Vehicle, Omit<Vehicle, "id" | "status">>({
      query: (body) => ({
        url: "/api/vehicles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vehicle"],
    }),

    updateVehicleStatus: builder.mutation<
      Vehicle,
      { vehicleId: number; status: VehicleStatus }
    >({
      query: ({ vehicleId, status }) => ({
        url: `/api/vehicles/${vehicleId}/status?status=${status}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Vehicle"],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleStatusMutation,
} = vehicleApi;
