import { AccountStatus, User } from "@/types/user";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<{ data: User; success: boolean }, void>({
      query: () => ({
        method: "GET",
        url: "/api/users/me",
      }),
    }),

    getUsers: builder.query<{ data: User[]; success: boolean }, void>({
      query: () => ({
        method: "GET",
        url: "/api/users",
      }),
      providesTags: ["User"],
    }),

    updateStatus: builder.mutation<
      void,
      { userId: number; status: AccountStatus }
    >({
      query: ({ userId, status }) => ({
        method: "PATCH",
        url: `/api/users/${userId}/status`,
        body: {
          status,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery, useUpdateStatusMutation } =
  userApi;
