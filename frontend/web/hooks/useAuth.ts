import { useGetUserQuery } from "@/store/api/userApi";

const useAuth = () => {
  const { data: user, isLoading, isError } = useGetUserQuery();

  return {
    user: user?.data,
    isLoading,
    isAuthenticated: !isError && !!user?.data,
  };
};

export default useAuth;
