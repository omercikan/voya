import { User } from "@/types/user";
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
  }),
});

export const { useGetUserQuery } = userApi;
