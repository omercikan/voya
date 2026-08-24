import { AccountStatus, User } from "@/types/user";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<{ data: User; success: boolean }, void>({
      query: () => ({
        method: "GET",
        url: "/api/users/me",
      }),
      providesTags: ["User"],
    }),

    getUsers: builder.query<{ data: User[]; success: boolean }, void>({
      query: () => ({
        method: "GET",
        url: "/api/users",
      }),
      providesTags: ["User"],
    }),

    createUser: builder.mutation<
      { data: User; success: boolean },
      Omit<User, "status" | "id">
    >({
      query: (body) => ({
        method: "POST",
        url: "/api/users",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      { data: User; success: boolean },
      { userId: number; body: Partial<User> }
    >({
      query: ({ userId, body }) => ({
        method: "PATCH",
        url: `/api/users/${userId}`,
        body: body,
      }),
      invalidatesTags: ["User"],
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

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateStatusMutation,
} = userApi;
